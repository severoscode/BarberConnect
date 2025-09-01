import {
  users,
  services,
  professionals,
  appointments,
  professionalServices,
  professionalSchedules,
  professionalBreaks,
  type User,
  type UpsertUser,
  type Service,
  type InsertService,
  type Professional,
  type InsertProfessional,
  type Appointment,
  type InsertAppointment,
  type ProfessionalService,
  type InsertProfessionalService,
  type ProfessionalSchedule,
  type InsertProfessionalSchedule,
  type ProfessionalBreak,
  type InsertProfessionalBreak,
  type ProfessionalWithUser,
  type AppointmentWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc, or, isNull } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Service operations
  getServices(): Promise<Service[]>;
  getService(serviceId: string): Promise<Service | undefined>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;

  // Professional operations
  getProfessionals(): Promise<ProfessionalWithUser[]>;
  getProfessionalByUserId(userId: string): Promise<Professional | undefined>;
  createProfessional(professional: InsertProfessional): Promise<Professional>;
  updateProfessional(id: string, professional: Partial<InsertProfessional>): Promise<Professional>;

  // Professional services
  getProfessionalServices(professionalId: string): Promise<(ProfessionalService & { service: Service })[]>;
  setProfessionalService(professionalService: InsertProfessionalService): Promise<ProfessionalService>;

  // Professional schedules
  getProfessionalSchedules(professionalId: string): Promise<ProfessionalSchedule[]>;
  setProfessionalSchedule(schedule: InsertProfessionalSchedule): Promise<ProfessionalSchedule>;

  // Professional breaks
  getProfessionalBreaks(professionalId: string, startDate: Date, endDate: Date): Promise<ProfessionalBreak[]>;
  createProfessionalBreak(breakData: InsertProfessionalBreak): Promise<ProfessionalBreak>;

  // Appointment operations
  getAppointments(userId: string, userType: 'client' | 'professional'): Promise<AppointmentWithDetails[]>;
  getAppointmentsByDateRange(startDate: Date, endDate: Date, professionalId?: string): Promise<AppointmentWithDetails[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: string): Promise<void>;
  getAvailableSlots(date: Date, serviceId: string, professionalId?: string): Promise<string[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services).where(eq(services.isActive, true)).orderBy(asc(services.name));
  }

  async getService(serviceId: string): Promise<Service | undefined> {
    const result = await db
      .select()
      .from(services)
      .where(eq(services.id, serviceId))
      .limit(1);
    return result[0];
  }

  async createService(service: InsertService): Promise<Service> {
    const [newService] = await db.insert(services).values(service).returning();
    return newService;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const [updatedService] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updatedService;
  }

  async deleteService(id: string): Promise<void> {
    await db.update(services).set({ isActive: false }).where(eq(services.id, id));
  }

  async getProfessionals(): Promise<ProfessionalWithUser[]>{
    const result = await db
      .select()
      .from(professionals)
      .innerJoin(users, eq(professionals.userId, users.id))
      .where(eq(professionals.isActive, true))
      .orderBy(desc(professionals.rating));

    return result.map((row) => ({
      ...row.professionals,
      user: row.users,
    }));
  }

  async getProfessionalByUserId(userId: string): Promise<Professional | undefined> {
    const [professional] = await db
      .select()
      .from(professionals)
      .where(eq(professionals.userId, userId));
    return professional;
  }

  async createProfessional(professional: InsertProfessional): Promise<Professional> {
    const [newProfessional] = await db.insert(professionals).values(professional).returning();
    return newProfessional;
  }

  async updateProfessional(id: string, professional: Partial<InsertProfessional>): Promise<Professional> {
    const [updatedProfessional] = await db
      .update(professionals)
      .set(professional)
      .where(eq(professionals.id, id))
      .returning();
    return updatedProfessional;
  }

  async getProfessionalServices(professionalId: string): Promise<(ProfessionalService & { service: Service })[]> {
    const result = await db
      .select()
      .from(professionalServices)
      .innerJoin(services, eq(professionalServices.serviceId, services.id))
      .where(eq(professionalServices.professionalId, professionalId));

    return result.map((row) => ({
      ...row.professional_services,
      service: row.services,
    }));
  }

  async setProfessionalService(professionalService: InsertProfessionalService): Promise<ProfessionalService> {
    const [result] = await db
      .insert(professionalServices)
      .values(professionalService)
      .onConflictDoUpdate({
        target: [professionalServices.professionalId, professionalServices.serviceId],
        set: { isEnabled: professionalService.isEnabled },
      })
      .returning();
    return result;
  }

  async getProfessionalSchedules(professionalId: string): Promise<ProfessionalSchedule[]> {
    return await db
      .select()
      .from(professionalSchedules)
      .where(and(
        eq(professionalSchedules.professionalId, professionalId),
        eq(professionalSchedules.isActive, true)
      ))
      .orderBy(asc(professionalSchedules.dayOfWeek), asc(professionalSchedules.startTime));
  }

  async setProfessionalSchedule(schedule: InsertProfessionalSchedule): Promise<ProfessionalSchedule> {
    const [result] = await db
      .insert(professionalSchedules)
      .values(schedule)
      .onConflictDoUpdate({
        target: [professionalSchedules.professionalId, professionalSchedules.dayOfWeek],
        set: {
          startTime: schedule.startTime,
          endTime: schedule.endTime,
          isActive: schedule.isActive,
        },
      })
      .returning();
    return result;
  }

  async getProfessionalBreaks(professionalId: string, startDate: Date, endDate: Date): Promise<ProfessionalBreak[]> {
    return await db
      .select()
      .from(professionalBreaks)
      .where(and(
        eq(professionalBreaks.professionalId, professionalId),
        gte(professionalBreaks.date, startDate),
        lte(professionalBreaks.date, endDate)
      ))
      .orderBy(asc(professionalBreaks.date), asc(professionalBreaks.startTime));
  }

  async createProfessionalBreak(breakData: InsertProfessionalBreak): Promise<ProfessionalBreak> {
    const [newBreak] = await db.insert(professionalBreaks).values(breakData).returning();
    return newBreak;
  }

  async getAppointments(userId: string, userType: 'client' | 'professional'): Promise<AppointmentWithDetails[]> {
    const whereCondition = userType === 'client' 
      ? eq(appointments.clientId, userId)
      : eq(appointments.professionalId, userId);

    const result = await db
      .select({
        appointment: appointments,
        client: users,
        professional: professionals,
        service: services,
        professionalUser: { 
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          userType: users.userType,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt
        }
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.clientId, users.id))
      .leftJoin(professionals, eq(appointments.professionalId, professionals.id))
      .leftJoin(
        { professionalUser: users }, 
        eq(professionals.userId, users.id)
      )
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(whereCondition)
      .orderBy(desc(appointments.startTime));

    return result.map((row) => ({
      ...row.appointment,
      client: row.client,
      professional: row.professional ? {
        ...row.professional,
        user: row.professionalUser,
      } : null as any,
      service: row.service,
    }));
  }

  async getAppointmentsByDateRange(startDate: Date, endDate: Date, professionalId?: string): Promise<AppointmentWithDetails[]> {
    let whereCondition = and(
      gte(appointments.startTime, startDate),
      lte(appointments.startTime, endDate)
    );

    if (professionalId) {
      whereCondition = and(
        whereCondition,
        eq(appointments.professionalId, professionalId)
      );
    }

    const result = await db
      .select({
        appointment: appointments,
        client: users,
        professional: professionals,
        service: services,
        professionalUser: { 
          id: users.id,
          email: users.email,
          firstName: users.firstName,
          lastName: users.lastName,
          profileImageUrl: users.profileImageUrl,
          userType: users.userType,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt
        }
      })
      .from(appointments)
      .innerJoin(users, eq(appointments.clientId, users.id))
      .leftJoin(professionals, eq(appointments.professionalId, professionals.id))
      .leftJoin(
        { professionalUser: users }, 
        eq(professionals.userId, users.id)
      )
      .innerJoin(services, eq(appointments.serviceId, services.id))
      .where(whereCondition)
      .orderBy(asc(appointments.startTime));

    return result.map((row) => ({
      ...row.appointment,
      client: row.client,
      professional: row.professional ? {
        ...row.professional,
        user: row.professionalUser,
      } : null as any,
      service: row.service,
    }));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async updateAppointment(id: string, appointment: Partial<InsertAppointment>): Promise<Appointment> {
    const [updatedAppointment] = await db
      .update(appointments)
      .set({ ...appointment, updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updatedAppointment;
  }

  async deleteAppointment(id: string): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
  }

  async getAvailableSlots(date: Date, serviceId: string, professionalId?: string): Promise<string[]> {
    const service = await this.getService(serviceId);
    if (!service) {
      return [];
    }

    // If no professional specified, get all professionals who offer this service
    let professionalsToCheck: string[] = [];
    if (professionalId) {
      professionalsToCheck = [professionalId];
    } else {
      const allProfessionals = await this.getProfessionals();
      const professionalServices = await Promise.all(
        allProfessionals.map(p => this.getProfessionalServices(p.id))
      );
      professionalsToCheck = allProfessionals
        .filter((p, index) => 
          professionalServices[index].some(ps => ps.serviceId === serviceId && ps.isEnabled)
        )
        .map(p => p.id);
    }

    const allAvailableSlots = new Set<string>();
    const serviceDurationMinutes = service.durationMinutes;
    const targetDayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    for (const profId of professionalsToCheck) {
      const professionalSchedules = await this.getProfessionalSchedules(profId);
      const professionalBreaks = await this.getProfessionalBreaks(profId, date, date);
      const existingAppointments = await this.getAppointmentsByDateRange(date, date, profId);

      // Filter schedules for the target day
      const daySchedules = professionalSchedules.filter(schedule => 
        schedule.dayOfWeek === targetDayOfWeek && schedule.isActive
      );

      for (const schedule of daySchedules) {
        const scheduleStartDate = new Date(date);
        const [startHour, startMinute] = schedule.startTime.split(':').map(Number);
        scheduleStartDate.setHours(startHour, startMinute, 0, 0);

        const scheduleEndDate = new Date(date);
        const [endHour, endMinute] = schedule.endTime.split(':').map(Number);
        scheduleEndDate.setHours(endHour, endMinute, 0, 0);

        let currentSlotStart = new Date(scheduleStartDate);

        while (currentSlotStart < scheduleEndDate) {
          const currentSlotEnd = new Date(currentSlotStart.getTime() + serviceDurationMinutes * 60000);

          // Check if the slot is within the schedule and not overlapping with breaks or appointments
          const isBreak = professionalBreaks.some(breakTime => {
            const breakStartTime = new Date(date);
            const [breakStartHour, breakStartMinute] = breakTime.startTime.split(':').map(Number);
            breakStartTime.setHours(breakStartHour, breakStartMinute, 0, 0);

            const breakEndTime = new Date(date);
            const [breakEndHour, breakEndMinute] = breakTime.endTime.split(':').map(Number);
            breakEndTime.setHours(breakEndHour, breakEndMinute, 0, 0);

            return (currentSlotStart >= breakStartTime && currentSlotStart < breakEndTime) ||
                   (currentSlotEnd > breakStartTime && currentSlotEnd <= breakEndTime) ||
                   (currentSlotStart < breakStartTime && currentSlotEnd > breakEndTime);
          });

          const isAppointment = existingAppointments.some(appointment => {
            const appointmentStartTime = new Date(appointment.startTime);
            const appointmentEndTime = new Date(appointment.endTime);

            return (currentSlotStart >= appointmentStartTime && currentSlotStart < appointmentEndTime) ||
                   (currentSlotEnd > appointmentStartTime && currentSlotEnd <= appointmentEndTime) ||
                   (currentSlotStart < appointmentStartTime && currentSlotEnd > appointmentEndTime);
          });

          if (!isBreak && !isAppointment && currentSlotEnd <= scheduleEndDate) {
            // Format time in HH:mm format (24h)
            const timeString = currentSlotStart.toTimeString().slice(0, 5);
            allAvailableSlots.add(timeString);
          }

          currentSlotStart = new Date(currentSlotStart.getTime() + 30 * 60000); // Increment by 30 minutes
        }
      }
    }

    // Convert Set to Array and sort
    return Array.from(allAvailableSlots).sort();
  }
}

export const storage = new DatabaseStorage();
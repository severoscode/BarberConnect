import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  pgEnum,
  time,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User types enum
export const userTypeEnum = pgEnum('user_type', ['client', 'barber', 'admin']);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: userTypeEnum("user_type").default('client'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Services table
export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  durationMinutes: integer("duration_minutes").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Professionals table
export const professionals = pgTable("professionals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  specialties: text("specialties"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default('0'),
  totalReviews: integer("total_reviews").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Professional services (many-to-many)
export const professionalServices = pgTable("professional_services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  professionalId: varchar("professional_id").references(() => professionals.id).notNull(),
  serviceId: varchar("service_id").references(() => services.id).notNull(),
  isEnabled: boolean("is_enabled").default(true),
});

// Professional schedules
export const professionalSchedules = pgTable("professional_schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  professionalId: varchar("professional_id").references(() => professionals.id).notNull(),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday, 1 = Monday, etc.
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  isActive: boolean("is_active").default(true),
});

// Professional breaks/pauses
export const professionalBreaks = pgTable("professional_breaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  professionalId: varchar("professional_id").references(() => professionals.id).notNull(),
  date: timestamp("date").notNull(),
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  reason: varchar("reason", { length: 255 }),
});

// Appointment status enum
export const appointmentStatusEnum = pgEnum('appointment_status', ['pending', 'confirmed', 'completed', 'cancelled', 'no_show']);

// Appointments table
export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientId: varchar("client_id").references(() => users.id).notNull(),
  professionalId: varchar("professional_id").references(() => professionals.id),
  serviceId: varchar("service_id").references(() => services.id).notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: appointmentStatusEnum("status").default('pending'),
  notes: text("notes"),
  cancellationReason: text("cancellation_reason"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  professional: one(professionals, {
    fields: [users.id],
    references: [professionals.userId],
  }),
  appointments: many(appointments),
}));

export const professionalsRelations = relations(professionals, ({ one, many }) => ({
  user: one(users, {
    fields: [professionals.userId],
    references: [users.id],
  }),
  services: many(professionalServices),
  schedules: many(professionalSchedules),
  breaks: many(professionalBreaks),
  appointments: many(appointments),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  professionals: many(professionalServices),
  appointments: many(appointments),
}));

export const professionalServicesRelations = relations(professionalServices, ({ one }) => ({
  professional: one(professionals, {
    fields: [professionalServices.professionalId],
    references: [professionals.id],
  }),
  service: one(services, {
    fields: [professionalServices.serviceId],
    references: [services.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  client: one(users, {
    fields: [appointments.clientId],
    references: [users.id],
  }),
  professional: one(professionals, {
    fields: [appointments.professionalId],
    references: [professionals.id],
  }),
  service: one(services, {
    fields: [appointments.serviceId],
    references: [services.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertProfessionalSchema = createInsertSchema(professionals).omit({
  id: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProfessionalServiceSchema = createInsertSchema(professionalServices).omit({
  id: true,
});

export const insertProfessionalScheduleSchema = createInsertSchema(professionalSchedules).omit({
  id: true,
});

export const insertProfessionalBreakSchema = createInsertSchema(professionalBreaks).omit({
  id: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Professional = typeof professionals.$inferSelect;
export type InsertProfessional = z.infer<typeof insertProfessionalSchema>;
export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type ProfessionalService = typeof professionalServices.$inferSelect;
export type InsertProfessionalService = z.infer<typeof insertProfessionalServiceSchema>;
export type ProfessionalSchedule = typeof professionalSchedules.$inferSelect;
export type InsertProfessionalSchedule = z.infer<typeof insertProfessionalScheduleSchema>;
export type ProfessionalBreak = typeof professionalBreaks.$inferSelect;
export type InsertProfessionalBreak = z.infer<typeof insertProfessionalBreakSchema>;

// Extended types for API responses
export type ProfessionalWithUser = Professional & { user: User };
export type AppointmentWithDetails = Appointment & {
  client: User;
  professional: ProfessionalWithUser;
  service: Service;
};
export type ServiceWithAvailability = Service & {
  isAvailable?: boolean;
  availableProfessionals?: number;
};

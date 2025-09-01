import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertServiceSchema, insertAppointmentSchema, insertProfessionalServiceSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      res.status(500).json({ message: "Failed to fetch services" });
    }
  });

  app.post("/api/services", isAuthenticated, async (req: any, res) => {
    try {
      const serviceData = insertServiceSchema.parse(req.body);
      const service = await storage.createService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      console.error("Error creating service:", error);
      res.status(400).json({ message: "Failed to create service" });
    }
  });

  // Professionals routes
  app.get("/api/professionals", async (req, res) => {
    try {
      const professionals = await storage.getProfessionals();
      res.json(professionals);
    } catch (error) {
      console.error("Error fetching professionals:", error);
      res.status(500).json({ message: "Failed to fetch professionals" });
    }
  });

  app.get("/api/professionals/me", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const professional = await storage.getProfessionalByUserId(userId);
      res.json(professional);
    } catch (error) {
      console.error("Error fetching professional:", error);
      res.status(500).json({ message: "Failed to fetch professional" });
    }
  });

  app.get("/api/professionals/:id/services", async (req, res) => {
    try {
      const { id } = req.params;
      const services = await storage.getProfessionalServices(id);
      res.json(services);
    } catch (error) {
      console.error("Error fetching professional services:", error);
      res.status(500).json({ message: "Failed to fetch professional services" });
    }
  });

  app.post("/api/professionals/:id/services", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const serviceData = insertProfessionalServiceSchema.parse({
        ...req.body,
        professionalId: id,
      });
      const service = await storage.setProfessionalService(serviceData);
      res.status(201).json(service);
    } catch (error) {
      console.error("Error setting professional service:", error);
      res.status(400).json({ message: "Failed to set professional service" });
    }
  });

  // Available slots route
  app.get("/api/available-slots", async (req, res) => {
    try {
      const { date, serviceId, professionalId } = req.query;
      
      if (!date || !serviceId) {
        return res.status(400).json({ message: "Date and serviceId are required" });
      }

      const slots = await storage.getAvailableSlots(
        new Date(date as string),
        serviceId as string,
        professionalId as string
      );
      res.json(slots);
    } catch (error) {
      console.error("Error fetching available slots:", error);
      res.status(500).json({ message: "Failed to fetch available slots" });
    }
  });

  // Appointments routes
  app.get("/api/appointments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userType = user.userType === 'barber' ? 'professional' : 'client';
      let appointments;

      if (userType === 'professional') {
        const professional = await storage.getProfessionalByUserId(userId);
        if (professional) {
          appointments = await storage.getAppointments(professional.id, 'professional');
        } else {
          appointments = [];
        }
      } else {
        appointments = await storage.getAppointments(userId, 'client');
      }

      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.get("/api/appointments/range", isAuthenticated, async (req: any, res) => {
    try {
      const { startDate, endDate, professionalId } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }

      const appointments = await storage.getAppointmentsByDateRange(
        new Date(startDate as string),
        new Date(endDate as string),
        professionalId as string
      );
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments by range:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.post("/api/appointments", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointmentData = insertAppointmentSchema.parse({
        ...req.body,
        clientId: userId,
      });

      const appointment = await storage.createAppointment(appointmentData);
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(400).json({ message: "Failed to create appointment" });
    }
  });

  app.put("/api/appointments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const appointment = await storage.updateAppointment(id, updateData);
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(400).json({ message: "Failed to update appointment" });
    }
  });

  app.delete("/api/appointments/:id", isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      await storage.deleteAppointment(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(400).json({ message: "Failed to delete appointment" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

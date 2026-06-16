import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { sendNewLeadNotification, sendNewJobApplicationNotification } from "../lib/mailer.js";
const router = Router();
const prisma = new PrismaClient();
// POST /api/leads/services
router.post("/services", async (req, res) => {
    try {
        const { name, phone, petName, petType, service, date, timeSlot } = req.body;
        if (!name || !phone || !service || !date || !timeSlot) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const lead = await prisma.servicelead.create({
            data: {
                name,
                phone,
                petName,
                petType,
                service,
                date: new Date(date),
                timeSlot,
            },
        });
        // Send email asynchronously
        sendNewLeadNotification(lead).catch(console.error);
        res.status(201).json({ success: true, lead });
    }
    catch (error) {
        console.error("Error creating service lead:", error);
        res.status(500).json({ error: "Failed to submit booking request" });
    }
});
// POST /api/leads/careers
router.post("/careers", async (req, res) => {
    try {
        const { jobTitle, jobId, name, email, phone, coverLetter } = req.body;
        if (!jobTitle || !name || !email || !phone) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const application = await prisma.jobapplication.create({
            data: {
                jobTitle,
                jobId,
                name,
                email,
                phone,
                coverLetter,
            },
        });
        // Send email asynchronously
        sendNewJobApplicationNotification(application).catch(console.error);
        res.status(201).json({ success: true, application });
    }
    catch (error) {
        console.error("Error creating job application:", error);
        res.status(500).json({ error: "Failed to submit application" });
    }
});
export default router;

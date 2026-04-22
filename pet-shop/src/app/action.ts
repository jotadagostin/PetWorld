'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import z from 'zod';

const appointmentSchema = z.object({
  tutorName: z.string(),
  petName: z.string(),
  phone: z.string(),
  description: z.string(),
  scheduleAt: z.date(),
});

type AppointmentData = z.infer<typeof appointmentSchema>;

export async function createAppointment(data: any) {
  try {
    const parsedData = appointmentSchema.parse(data);
    const { scheduleAt } = parsedData;
    const hour = scheduleAt.getHours();

    const isMorning = hour >= 9 && hour < 12;
    const isAfternoon = hour >= 13 && hour < 18;
    const isEvening = hour >= 19 && hour < 21;

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error:
          'Schedule can be only between 9h and 12h, 13h and 18h or 19h and 21h',
      };
    }

    const existingApointment = await prisma.appointment.findFirst({
      where: {
        scheduleAt,
      },
    });

    if (existingApointment) {
      return {
        error: 'this hour is already reserved',
      };
    }

    await prisma.appointment.create({
      data: {
        ...parsedData,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.log(error);

    return {
      error: 'Error creating appointment, try again later',
    };
  }
}

export async function updateAppointment(id: string, data: AppointmentData) {
  try {
    const parsedData = appointmentSchema.parse(data);

    const { scheduleAt } = parsedData;
    const hour = scheduleAt.getHours();

    const isMorning = hour >= 9 && hour < 12;
    const isAfternoon = hour >= 13 && hour < 18;
    const isEvening = hour >= 19 && hour < 21;

    if (!isMorning && !isAfternoon && !isEvening) {
      return {
        error:
          'Schedule can be only between 9h and 12h, 13h and 18h or 19h and 21h',
      };
    }

    const existingApointment = await prisma.appointment.findFirst({
      where: {
        scheduleAt,
        id: {
          not: id,
        },
      },
    });

    if (existingApointment) {
      return {
        error: 'this hour is already reserved',
      };
    }

    await prisma.appointment.update({
      where: {
        id,
      },
      data: {
        ...parsedData,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.log(error);

    return {
      error: 'Error updating appointment, try again later',
    };
  }
}

export async function deleteAppointment(id: string) {
  try {
    await prisma.appointment.delete({
      where: {
        id,
      },
    });

    revalidatePath('/');
  } catch (error) {
    console.log(error);

    return {
      error: 'Error deleting appointment, try again later',
    };
  }
}

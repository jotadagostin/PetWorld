import { Appointment as AppointmentPrisma } from '@/app/generated/prisma/client';
import {
  Appointment,
  AppointmentPeriod,
  AppointmentPeriodDay,
} from '@/types/appointment';

const getPeriod = (hour: number): AppointmentPeriodDay => {
  if (hour >= 9 && hour < 12) return 'morning';
  if (hour >= 13 && hour < 18) return 'afternoon';
  return 'evening';
};

export function groupAppointmentsByPeriod(
  appointments: AppointmentPrisma[]
): AppointmentPeriod[] {
  const transformedAppointments: Appointment[] = appointments?.map((apt) => ({
    ...apt,
    time: apt.scheduleAt.toLocaleTimeString('en', {
      hour: '2-digit',
      minute: '2-digit',
    }),
    service: apt.description,
    period: getPeriod(apt.scheduleAt.getHours()),
  }));

  const morningAppointments = transformedAppointments.filter(
    (apt) => apt.period === 'morning'
  );
  const afternoonAppointments = transformedAppointments.filter(
    (apt) => apt.period === 'afternoon'
  );
  const eveningAppointments = transformedAppointments.filter(
    (apt) => apt.period === 'evening'
  );

  return [
    {
      title: 'Morning',
      type: 'morning',
      timeRange: '9:00 - 12:00',
      appointments: morningAppointments,
    },
    {
      title: 'Afternoon',
      type: 'afternoon',
      timeRange: '13:00 - 18:00',
      appointments: afternoonAppointments,
    },
    {
      title: 'Evening',
      type: 'evening',
      timeRange: '19:00 - 22:00',
      appointments: eveningAppointments,
    },
  ];
}

export function calculatePeriod(hour: number) {
  const isMorning = hour >= 9 && hour < 12;
  const isAfternoon = hour >= 13 && hour < 18;
  const isEvening = hour >= 19 && hour < 21;

  return {
    isMorning,
    isAfternoon,
    isEvening,
  };
}

export function formatDateTime(date: Date): string {
  return date.toLocaleTimeString('');
}

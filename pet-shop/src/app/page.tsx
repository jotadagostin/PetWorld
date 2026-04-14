import { prisma } from '@/lib/prisma';
import { PeriodSection } from '../components/period-section';
import { APPOINTMENT_DATA, groupAppointmentsByPeriod } from '@/utils';

export default async function Home() {
  const appointment = await prisma.appointment.findMany();
  const periods = groupAppointmentsByPeriod(APPOINTMENT_DATA);

  return (
    <div className="bg-background-primary p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-title-size text-content-primary mb-2">
            Your Agenda
          </h1>
          <p className="text-paragraph-medium-size text-content-secondary">
            here you can see all clients and services scheduled for today.
          </p>
        </div>
      </div>

      <div className="pb-24 md:pb-0">
        {periods.map((period, index) => (
          <PeriodSection key={index} period={period} />
        ))}
      </div>
    </div>
  );
}

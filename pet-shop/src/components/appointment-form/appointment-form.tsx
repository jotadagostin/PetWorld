'use client';

import z from 'zod';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import {
  Calendar,
  CalendarIcon,
  ChevronDownIcon,
  Clock,
  Dog,
  Loader2,
  Phone,
  User,
} from 'lucide-react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { IMaskInput } from 'react-imask';
import { format, setHours, setMinutes, startOfToday } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { cn } from '@/lib/utils';
import { CalendarPicker } from '../ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { toast } from 'sonner';
import { createAppointment, updateAppointment } from '@/app/action';
import { useEffect, useState } from 'react';
import { Appointment } from '@/types/appointment';

const appoimentFormSchema = z
  .object({
    tutorName: z.string().min(3, 'Tutor name is required'),
    petName: z.string().min(3, 'Pet name is required'),
    phone: z.string().min(11, 'Phone number is required'),
    description: z.string().min(3, 'Description is required'),
    scheduleAt: z
      .date({
        error: 'Schedule date is required',
      })
      .min(startOfToday(), {
        message: 'Schedule date must be in the future',
      }),
    time: z.string().min(1, 'Schedule time is required'),
  })
  .refine(
    (data) => {
      const [hour, minute] = data.time.split(':');
      const scheduleDateTime = setMinutes(
        setHours(data.scheduleAt, Number(hour)),
        Number(minute)
      );

      return scheduleDateTime > new Date();
    },
    {
      path: ['time'],
      error: 'Schedule date and time must be in the future',
    }
  );

type AppointmentFormValues = z.infer<typeof appoimentFormSchema>;

type AppointmentFormProps = {
  appointment?: Appointment;
  children?: React.ReactNode;
};

export const AppointmentForm = ({
  appointment,
  children,
}: AppointmentFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appoimentFormSchema),
    defaultValues: {
      tutorName: '',
      petName: '',
      phone: '',
      description: '',
      scheduleAt: undefined,
      time: '',
    },
  });

  const onSubmit = async (data: AppointmentFormValues) => {
    const [hour, minute] = data.time.split(':');

    const scheduleAt = setMinutes(
      setHours(data.scheduleAt, Number(hour)),
      Number(minute)
    );

    const isEdit = !!appointment?.id;

    const result = isEdit
      ? await updateAppointment(appointment.id, {
          ...data,
          scheduleAt,
        })
      : await createAppointment({
          ...data,
          scheduleAt,
        });

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(`Schedule  ${isEdit ? 'updated' : 'created'}  with sucess!`);
    setIsOpen(false);
    form.reset();
  };

  useEffect(() => {
    form.reset(appointment);
  }, [appointment, form]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}

      <DialogContent
        variant="appointment"
        overlayVariant="blurred"
        showCloseButton
      >
        <DialogHeader>
          <DialogTitle size="modal">Schedule an appointment</DialogTitle>
          <DialogDescription size="modal">
            Fill all the client's data to make the appointment
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="tutorName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Tutor Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-content-brand transform"
                        size={20}
                      />
                      <Input
                        placeholder="Tutors name"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="petName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Pet Name
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Dog
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-content-brand transform"
                        size={20}
                      />
                      <Input
                        placeholder="Tutors name"
                        className="pl-10"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Phone Number
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-content-brand transform"
                        size={20}
                      />
                      <IMaskInput
                        placeholder="(99) 99999-9999"
                        mask="(00) 0000-0000"
                        className="pl-10 flex h-12 w-full rounded-md border border-border-primary bg-background-tertiary px-3 py-2 text-sm text-content-primary ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-content-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:ring-border-brand disabled:cursor-not-allowed disabled:opacity-50 hover:border-border-secondary focus:border-border-brand focus-visible:border-border-brand aria-invalid:ring-destructive/20 aria-invalid:border-destructive"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-label-medium-size text-content-primary">
                    Description
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="service description"
                        className="resize-none"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 md:grid md:grid-cols-2 md:gap-2 md:space-y-0">
              <FormField
                control={form.control}
                name="scheduleAt"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Data
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full justify-between text-left font-normal bg-background-tertiary border-border-primary text-content-primary hover:bg-background-tertiary hover:border-border-secondary hover:text-content-primary focus-visible:ring-offset-0 focus-visible:ring-1 focus-visible:ring-border-brand focus:border-border-brand focus-visible:border-border-brand',
                              !field.value && 'text-content-secondary'
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <CalendarIcon
                                className=" text-content-brand"
                                size={20}
                              />
                              {field.value ? (
                                format(field.value, 'dd/MM/yyyy')
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                            </div>
                            <ChevronDownIcon className="opacity-50 h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarPicker
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < startOfToday()}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-label-medium-size text-content-primary">
                      Hour
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <div className="flex items-center gap-2">
                            <Clock className="h4 w-4 text-content-brand" />
                            <SelectValue placeholder="--.-- --" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_OPTIONS.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                variant="brand"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Schedule
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

const generateTimeOptions = (): string[] => {
  const times = [];

  for (let hour = 9; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      if (hour === 21 && minute > 0) break; // Stop at 21:00
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      times.push(timeString);
    }
  }
  return times;
};

const TIME_OPTIONS = generateTimeOptions();

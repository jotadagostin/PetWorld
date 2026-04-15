'use client';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

export const AppointmentForm = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="brand">New Schedule</Button>
      </DialogTrigger>

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
      </DialogContent>
    </Dialog>
  );
};

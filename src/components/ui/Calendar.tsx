import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick

export default function Calendar() {
  interface DateClickArg {
    dateStr: string;
  }

  const handleDateClick = (arg: DateClickArg): void => {
    alert(arg.dateStr);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      dateClick={handleDateClick}
    />
  );
}

import { matchSorter } from "match-sorter";
import sortBy from "sort-by";
import invariant from "tiny-invariant";

export type AppointmentStatus = "scheduled" | "completed" | "cancelled";

export type AppointmentMutation = {
  id?: string;
  patientId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  reason: string;
  status: AppointmentStatus;
  notes?: string;
};

export type AppointmentRecord = AppointmentMutation & {
  id: string;
  createdAt: string;
};

const fakeAppointments = {
  records: {} as Record<string, AppointmentRecord>,

  async getAll(): Promise<AppointmentRecord[]> {
    return Object.keys(fakeAppointments.records)
      .map((key) => fakeAppointments.records[key])
      .sort(sortBy("date", "time"));
  },

  async get(id: string): Promise<AppointmentRecord | null> {
    return fakeAppointments.records[id] || null;
  },

  async getByPatient(patientId: string): Promise<AppointmentRecord[]> {
    const all = await fakeAppointments.getAll();
    return all.filter((apt) => apt.patientId === patientId);
  },

  async create(values: AppointmentMutation): Promise<AppointmentRecord> {
    const id = values.id || Math.random().toString(36).substring(2, 9);
    const createdAt = new Date().toISOString();
    const newAppointment = { id, createdAt, ...values };
    fakeAppointments.records[id] = newAppointment;
    return newAppointment;
  },

  async update(id: string, values: Partial<AppointmentMutation>): Promise<AppointmentRecord> {
    const appointment = await fakeAppointments.get(id);
    invariant(appointment, `No appointment found for ${id}`);
    const updatedAppointment = { ...appointment, ...values };
    fakeAppointments.records[id] = updatedAppointment;
    return updatedAppointment;
  },

  destroy(id: string): null {
    delete fakeAppointments.records[id];
    return null;
  },
};

export async function getAppointments(query?: string | null) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let appointments = await fakeAppointments.getAll();
  if (query) {
    appointments = matchSorter(appointments, query, {
      keys: ["patientName", "doctorName", "reason"],
    });
  }
  return appointments.sort(sortBy("date", "time"));
}

export async function getAppointment(id: string) {
  return fakeAppointments.get(id);
}

export async function getPatientAppointments(patientId: string) {
  return fakeAppointments.getByPatient(patientId);
}

export async function createAppointment(values: AppointmentMutation) {
  return fakeAppointments.create(values);
}

export async function updateAppointment(id: string, values: Partial<AppointmentMutation>) {
  return fakeAppointments.update(id, values);
}

export async function cancelAppointment(id: string) {
  return fakeAppointments.update(id, { status: "cancelled" });
}

export async function completeAppointment(id: string) {
  return fakeAppointments.update(id, { status: "completed" });
}

export async function deleteAppointment(id: string) {
  fakeAppointments.destroy(id);
}

const sampleAppointments = [
  {
    patientId: "shruti-kapoor",
    patientName: "Shruti Kapoor",
    doctorName: "Dr. Smith",
    date: "2026-02-28",
    time: "09:00",
    reason: "Regular Checkup",
    status: "scheduled" as AppointmentStatus,
  },
  {
    patientId: "righteousness-ude",
    patientName: "Righteousness Ude",
    doctorName: "Dr. Johnson",
    date: "2026-02-28",
    time: "10:30",
    reason: "Follow-up",
    status: "scheduled" as AppointmentStatus,
  },
  {
    patientId: "ryan-florence",
    patientName: "Ryan Florence",
    doctorName: "Dr. Williams",
    date: "2026-03-01",
    time: "14:00",
    reason: "Consultation",
    status: "scheduled" as AppointmentStatus,
  },
  {
    patientId: "oscar-newman",
    patientName: "Oscar Newman",
    doctorName: "Dr. Brown",
    date: "2026-02-20",
    time: "11:00",
    reason: "Annual Physical",
    status: "completed" as AppointmentStatus,
  },
];

sampleAppointments.forEach((apt) => {
  fakeAppointments.create(apt);
});

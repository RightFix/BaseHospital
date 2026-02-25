import { json } from "@remix-run/node";
import {
  Form,
  NavLink,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import { getAppointments, createAppointment, updateAppointment, deleteAppointment } from "../appointments";
import { useState } from "react";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const appointments = await getAppointments(q);
  return json({ appointments, q });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    const patientName = formData.get("patientName") as string;
    const doctorName = formData.get("doctorName") as string;
    const date = formData.get("date") as string;
    const time = formData.get("time") as string;
    const reason = formData.get("reason") as string;
    
    await createAppointment({
      patientId: patientName.toLowerCase().replace(/\s+/g, "-"),
      patientName,
      doctorName,
      date,
      time,
      reason,
      status: "scheduled",
    });
  } else if (intent === "updateStatus") {
    const id = formData.get("id") as string;
    const status = formData.get("status") as "scheduled" | "completed" | "cancelled";
    await updateAppointment(id, { status });
  } else if (intent === "delete") {
    const id = formData.get("id") as string;
    await deleteAppointment(id);
  }

  return json({ success: true });
};

export default function Appointments() {
  const { appointments, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [showForm, setShowForm] = useState(false);

  const isLoading = navigation.state === "loading";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled": return "status-scheduled";
      case "completed": return "status-completed";
      case "cancelled": return "status-cancelled";
      default: return "";
    }
  };

  return (
    <div id="appointments-page">
      <div className="page-header">
        <h1>Appointments</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
          {showForm ? "Cancel" : "New Appointment"}
        </button>
      </div>

      {showForm && (
        <Form method="post" className="appointment-form" onSubmit={() => setShowForm(false)}>
          <input type="hidden" name="intent" value="create" />
          <div className="form-group">
            <label>Patient Name</label>
            <input type="text" name="patientName" required placeholder="Enter patient name" />
          </div>
          <div className="form-group">
            <label>Doctor</label>
            <input type="text" name="doctorName" required placeholder="Dr. Name" />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Date</label>
              <input type="date" name="date" required />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" name="time" required />
            </div>
          </div>
          <div className="form-group">
            <label>Reason</label>
            <input type="text" name="reason" required placeholder="Reason for visit" />
          </div>
          <button type="submit" className="btn btn-primary">Schedule</button>
        </Form>
      )}

      <div className="appointments-list">
        {appointments.length === 0 ? (
          <p className="no-data">No appointments found</p>
        ) : (
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((apt) => (
                <tr key={apt.id} className={isLoading ? "loading" : ""}>
                  <td>{apt.patientName}</td>
                  <td>{apt.doctorName}</td>
                  <td>{apt.date} at {apt.time}</td>
                  <td>{apt.reason}</td>
                  <td>
                    <span className={`status-badge ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </td>
                  <td className="actions">
                    {apt.status === "scheduled" && (
                      <>
                        <Form method="post" style={{ display: "inline" }}>
                          <input type="hidden" name="intent" value="updateStatus" />
                          <input type="hidden" name="id" value={apt.id} />
                          <input type="hidden" name="status" value="completed" />
                          <button type="submit" className="btn-small btn-success">Complete</button>
                        </Form>
                        <Form method="post" style={{ display: "inline" }}>
                          <input type="hidden" name="intent" value="updateStatus" />
                          <input type="hidden" name="id" value={apt.id} />
                          <input type="hidden" name="status" value="cancelled" />
                          <button type="submit" className="btn-small btn-warning">Cancel</button>
                        </Form>
                      </>
                    )}
                    <Form method="post" style={{ display: "inline" }}>
                      <input type="hidden" name="intent" value="delete" />
                      <input type="hidden" name="id" value={apt.id} />
                      <button type="submit" className="btn-small btn-danger">Delete</button>
                    </Form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

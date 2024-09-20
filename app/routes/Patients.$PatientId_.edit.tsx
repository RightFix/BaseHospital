import type { 
    ActionFunctionArgs,
    LoaderFunctionArgs, 
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form,
   useLoaderData,
    useNavigate,
   } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getPatient, updatePatient } from "../data";

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.PatientId, "Missing PatientId param");
  const Patient = await getPatient(params.PatientId);
  if (!Patient) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ Patient });
};

export const action = async ({
    params,
    request,
  }: ActionFunctionArgs) => {
    invariant(params.PatientId, "Missing PatientId param");
    const formData = await request.formData();
    //const firstName = formData.get("first");
   // const lastName = formData.get("last");
    const updates = Object.fromEntries(formData);
    //updates.first;
    //updates.last;
    await updatePatient(params.PatientId, updates);
    return redirect(`/Patients/${params.PatientId}`);
  };

export default function EditPatient() {
  const { Patient } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form key={Patient.id} id="Patient-form" method="post">
      <p>
        <span>Name</span>
        <input
          defaultValue={Patient.first}
          aria-label="First name"
          name="first"
          type="text"
          placeholder="First"
        />
        <input
          aria-label="Last name"
          defaultValue={Patient.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Email</span>
        <input
          defaultValue={Patient.Email}
          name="Email"
          placeholder="example@gmail.com"
          type='email'
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={Patient.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          defaultValue={Patient.notes}
          name="notes"
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} type="reset" >Cancel</button>
      </p>
    </Form>
  );
}
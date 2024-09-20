import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";

import { deletePatient } from "../data";

export const action = async ({
  params,
}: ActionFunctionArgs) => {
  invariant(params.PatientId, "Missing PatientId param");
  await deletePatient(params.PatientId);
  return redirect("/");
};


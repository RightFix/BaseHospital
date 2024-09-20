import { json }  from "@remix-run/node";
import { Form, 
    useFetcher,
    useLoaderData,
} from "@remix-run/react";

import type { 
    ActionFunctionArgs,
    LoaderFunctionArgs, 
} from "@remix-run/node";

import { getPatient, updatePatient } from "../data";

import invariant from "tiny-invariant"; 

export const action = async ({
    params,
    request,
}: ActionFunctionArgs) =>{
    invariant(params.PatientId, "Missing PatientId param");
    const formData =await request.formData();
    return updatePatient(params.PatientId, {
        favorite: formData.get("favorite") === "true",
    });
};

export const loader = async ({ 
    params,
 }: LoaderFunctionArgs) => {
    invariant (params.PatientId, "Missing PatientId param");  
    const  Patient = await getPatient(params.PatientId);
    if(!Patient){
        throw new Response("Not Found", {status: 404});
    }
    return json ({Patient}); 
};
import type { FunctionComponent } from "react";

import type { PatientRecord } from "../data";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from "react";

export default function Patient() {
    const { Patient } = useLoaderData<typeof loader>();

   /* const Patients = {
        first: "Your",
        last: "Name",
        avatar: "https://placekitten.com/200/200",
        Email: "your_handle",
        notes: "Some notes",
        favorite: true,
    };*/

    return (
        <div id="Patient">
            <div>
                <img
                    alt={`${Patient.first} ${Patient.last} avatar`}
                    key={Patient.avatar}
                    src={Patient.avatar}
                />
            </div>

            <div>
                <h1>
                    {Patient.first || Patient.last ? (
                        <>
                            {Patient.first} {Patient.last}
                        </>
                    ) : (
                        <i>No Name</i>
                    )}{" "}
                    <Favorite Patient={Patient} />
                </h1>

                {Patient.Email ? (
                    <p>
                        <a
                            href={`mailto:${Patient.Email}`}
                            target="blank"
                        >
                            {Patient.Email}
                        </a>
                    </p>
                ) : null}

                {Patient.notes ? <p>{Patient.notes}</p> : null}

                <div>
                    <Form action="edit">
                        <button type="submit">Edit</button>
                    </Form>

                    <Form
                        action="destroy"
                        method="post"
                        onSubmit={(event) => {
                            const response = confirm(
                                "Please confirm you want to delete this record."
                            );
                            if (!response) {
                                event.preventDefault();
                            }
                        }}
                    >
                        <button type="submit">Delete</button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

const Favorite: FunctionComponent<{
    Patient: Pick<PatientRecord, "favorite">;
}> = ({ Patient }) => {
    const fetcher = useFetcher();
    const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    :Patient.favorite;

    return (
        <fetcher.Form method="post">
            <button
                aria-label={
                    favorite
                        ? "Remove from favorites"
                        : "Add to favorites"
                }
                name="favorite"
                value={favorite ? "false" : "true"}
            >
                {favorite ? "★" : "☆"}
            </button>
        </fetcher.Form>
    );
};

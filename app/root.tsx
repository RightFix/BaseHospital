import { json, redirect } from "@remix-run/node";
import {
  Form,
  NavLink,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";
 
import { useEffect  } from "react";

//import { getPatients } from "./data";

import { createEmptyPatient, getPatients } from "./data";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const Patients = await getPatients(q);
  return json({ Patients, q });
};

export const action = async () => {
  const Patient = await createEmptyPatient();
  return redirect(`/Patients/${Patient.id}/edit`);
};

export default function App() {
  const { Patients, q } = useLoaderData<typeof loader>();
  const navigation = useNavigation(); 
  const submit = useSubmit();
  const searching = navigation.location && new URLSearchParams(navigation.location.search).has("q"); 

useEffect(() => {
  const searchField =  document.getElementById("q");
  if (searchField instanceof HTMLInputElement){
    searchField.value = q || "";
  }
}, [q]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1> <img src="../public/favicon.ico" alt="logo" id="PageLogo" /> Base Hospital Patient Records</h1>
          <div>
            <Form id="search-form" 
            onChange={(event ) => {
               const isFirstSearch = q === null;        
              submit(event.currentTarget, {
                replace: !isFirstSearch,
              });
            }}
            role="search">
              <input
                id="q"
                aria-label="Search Patients"
                className= {searching ? "loading" : ""}
                defaultValue={q || ""}
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={!searching} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
            {Patients.length ? (
              <ul>
                {Patients.map((Patient) => (
                  <li key={Patient.id}>
                    <NavLink
                      className={({ isActive, isPending }) =>
                        isActive
                          ? "active"
                          : isPending
                            ? "pending"
                            : ""
                      }
                      to={`Patients/${Patient.id}`}>
                      {Patient.first || Patient.last ? (
                        <>
                          {Patient.first} {Patient.last}
                        </>
                      ) : (
                        <i>No Name</i>
                      )}{" "}
                      {Patient.favorite ? (
                        <span>★</span>
                      ) : null}
                    </NavLink>
                  </li>
                ))}
              </ul>
            ) : (
              <p>
                <i>No Patients</i>
              </p>
            )}
          </nav>
          </div>
          <div 
          className={
          navigation.state === "loading" && !searching
           ? "loading" 
           : ""
          }
        id="detail">
          <Outlet />
          </div>
        
        
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
import type { LinksFunction ,
  LoaderFunctionArgs ,
 } from "@remix-run/node";


import appStylesHref from "./app.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStylesHref },
];
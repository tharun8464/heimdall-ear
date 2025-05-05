import React from "react";
import JobCard from "../../Components/Dashbaord/UserJobCard.jsx";
import { listJobsUser, FilterCompany } from "../../service/api.js";
import { CSVLink } from "react-csv";
import { Formik, Field, Form } from 'formik';
import ls from 'localstorage-slim';
import { getStorage, setStorage, setSessionStorage } from "../../service/storageService";

const JobList = () => {
  const [jobs, setJobs] = React.useState([]);

  const headerso = [
    { label: "job_id", key: "_id" },
    { label: "job_title", key: "jobTitle" },
    { label: "job_description", key: "jobDesc" },
    { label: "createTime", key: "createTime" },
    { label: "uploadedBy", key: "uploadBy" },
    { label: "location", key: "location" },
    { label: "job_type", key: "jobType" },
    { label: "applicants", key: "applicants" },
    { label: "valid_till", key: "validTill" },
    { label: "hiring_organization", key: "hiringOrganization" },
    { label: "basic_salary", key: "basicSalary" },
  ];

  const csvReport = {
    filename: "jobs.csv",
    headers: headerso,
    data: jobs,
  };

  React.useEffect(() => {
    const getData = async () => {
      let res = await listJobsUser();
      //console.log(res);
      if (res && res.data) {
        setJobs(res.data.jobs);
        //console.log(res.data.jobs);
        let arr = [...res.data.jobs];
        const jsonObj = JSON.stringify(arr);

        // save to localStorage
        //setSessionStorage("jobsdetails", jsonObj);
        setSessionStorage("jobsdetails", jsonObj);
      }
    };
    getData();
  }, []);

  return (
    <>
      {" "}
      <div
        className="flex  mx-5 mt-3"
        style={{ justifyContent: "space-between" }}
      >
        <p className="text-2xl mx-3 font-semibold pl-3 mt-5">All Jobs</p>
        <div className="py-3">


          <p className="text-gray-900 text-s mb-2 mx-5 text-right text-blue"><CSVLink {...csvReport}><button style={{ backgroundColor: "#034488", color: "#fff" }}
            className=" p-3 w-10vw rounded-md text-white">Download CSV</button></CSVLink></p>
        </div>
      </div>
      <div className="p-5  w-full md:flex mx-auto">
        <div className="md:w-1/4 sm:w-full mt-5 h-3/5 shadow-lg rounded-lg">

          <Formik
            initialValues={{
              picked: 'One',
              toggle: false,
              checked: [],
            }}
            onSubmit={async (values) => {
              //console.log(values);
            }}
          >
            {({ values }) => (
              <Form className="text-center px-5 py-3 bg-white">
                <div className="text-2xl text-center font-bold font-gray-600">Apply Filters</div>


                <div className="flex-column content-center text-left align-items-center  py-3 my-5 w-3/4 mx-auto  border-t border-gray-300">

                  <label className="font-semibold text-md my-3">Job-Type</label><br />
                  <Field className="rounded-lg w-full" name="jobType" as="select">
                    <option value="fulltime">Full time</option>
                    <option value="internship">Internship</option>
                    <option value="parttime">Part Time</option>
                  </Field>

                </div>

                <div className="flex-column content-center text-left align-items-center  py-3 my-5 w-3/4 mx-auto ">

                  <label className="font-semibold text-md my-3">Location</label>
                  <Field
                    type="text"
                    className="block  rounded-lg py-1 md:w-3/4 w-full"
                    name="location"

                  // style={{ boxShadow: "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px", border: "none" }}

                  />

                </div>

                <div className="flex-column content-center text-left align-items-center  py-3 my-5 w-5/6 mx-auto ">

                  <label className="font-semibold text-md my-3">Pay Range</label>
                  <div className="flex flex-col space-y-2 p-2 w-full">
                    <Field type="range" className="w-full" name="salary" min="1" max="5" step="1" />
                    <ul className="flex justify-between w-full px-[10px]">
                      <li className="flex justify-center relative"><span className="absolute">0</span></li>
                      <li className="flex justify-center relative"><span className="absolute">5k</span></li>
                      <li className="flex justify-center relative"><span className="absolute">10k</span></li>
                      <li className="flex justify-center relative"><span className="absolute">20k</span></li>
                      <li className="flex justify-center relative"><span className="absolute">40k</span></li>
                    </ul>
                  </div>

                </div>


                <button
                  className="shadow-lg rounded-lg my-4 px-4 py-2"
                  style={{ backgroundColor: "#034488", color: "#fff" }}
                  type="submit"
                // onClick={() => applyFilter(values)}
                >
                  Apply
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className=" md:w-3/4 md:mx-5">
          <div className="p-2 w-full">
            {jobs &&
              jobs.map((job) => {
                return <JobCard job={job} />;
              })}
          </div>
        </div>
      </div>
    </>
  );
};

export default JobList;

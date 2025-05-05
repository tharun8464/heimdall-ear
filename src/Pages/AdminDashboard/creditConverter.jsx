import React, { useState, Fragment, useEffect } from "react";
import {
  getcreditList,
  getCompanycreditList,
  updateUserDetails,
  ListCreditConverter,
  addCreditConverter,
  updateCreditConverter,
} from "../../service/api";
import { Link } from "react-router-dom";
import { getUserFromId } from "../../service/api";
import { useNavigate } from "react-router-dom";
import { FiInfo } from "react-icons/fi";
import { BsCalendar, BsLinkedin } from "react-icons/bs";
import { GrScorecard } from "react-icons/gr";
import { Disclosure } from "@headlessui/react";
import { getSkills, url } from "../../service/api";
import { ChevronUpIcon, StarIcon } from "@heroicons/react/solid";
import { CgWorkAlt } from "react-icons/cg";
import { FaRegBuilding } from "react-icons/fa";
import { HiOutlineOfficeBuilding, HiPencil } from "react-icons/hi";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, ErrorMessage, Field } from "formik";
import swal from "sweetalert";
import { BsThreeDots, BsCashStack } from "react-icons/bs";
import { Popover } from "@headlessui/react";
import { ImCross } from "react-icons/im";
import { RiEditBoxLine } from "react-icons/ri";
import { AiOutlineDelete } from "react-icons/ai";

import currencies from "currencies.json";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/solid";
import ls from 'localstorage-slim';
import { getStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";

const CreditCategory = () => {
  const [creditList, setCreditList] = React.useState([]);
  const [modal, setModal] = React.useState(null);
  const [item, setItem] = React.useState(null);
  const [edit, setEdit] = React.useState(null);
  const [add_jobs, setadd_jobs] = React.useState(false);
  const [add_users, setadd_users] = React.useState(false);
  const [listCan, setlistCan] = React.useState(false);
  const [page, setPage] = useState(1);
  const [permissions, setPermissions] = React.useState([
    {
      title: "Add Jobs",
      id: "add_jobs",
      value: add_jobs,
    },
    {
      title: "Add Users",
      id: "add_users",
      value: add_users,
    },
    {
      title: "List Candidates",
      id: "list_candidates",
      value: listCan,
    },
  ]);
  const [currency, setCurrency] = React.useState(currencies.currencies[0]);
  const navigate = useNavigate();

  React.useEffect(() => {
    const initial = async () => {
      let user = JSON.parse(await getSessionStorage("user"));
      let res = await getUserFromId({ id: user._id }, user.access_token);
      //console.log(res);
      if (res && res.data && res.data.user) {
        if (res.data.user.permissions[0].admin_permissions.list_XI === false) {
          navigate(-1);
        }
      }
    };
    initial();
  }, []);

  React.useEffect(() => {
    const initial = async () => {
      let token = await getStorage("access_token");
      let user = JSON.parse(await getSessionStorage("user"));
      let response = await ListCreditConverter();
      if (response && response.status === 200) {
        setCreditList(response.data.category);
      }
    };
    initial();
  }, []);

  const [showLevelForm, setShowLevelForm] = React.useState(false);
  const [loader, setLoader] = useState(false);
  const paginate = (p) => {
    setPage(p);
    for (var i = 1; i <= creditList.length; i++) {
      document.getElementById("AdminUserCrd" + i).classList.add("hidden");
    }
    for (var j = 1; j <= 5; j++) {
      document
        .getElementById("AdminUserCrd" + ((p - 1) * 5 + j))
        .classList.remove("hidden");
    }
  };

  return (
    <div className="p-5">
      <div className="flex justify-between">
        <p className="text-2xl font-semibold mx-10">Credit Convertor</p>
        <div className="mx-1">
          <button
            className=" p-1 lg:p-3 md:p-3 sm:p-3 text-xs lg:text-lg md:text-sm rounded-md text-white"
            style={{ backgroundColor: "#034488" }}
            onClick={() => {
              setModal(true);
              setShowLevelForm(false);
            }}
          >
            Add Currency
          </button>
        </div>
      </div>
      <div className="mt-3">
        <div className=" md:w-3/4 mb-4 md:mx-5">
          {loader ? (
            <p>...Loading</p>
          ) : (
            <>
              {modal && (
                <Transition
                  appear
                  show={modal}
                  as={Fragment}
                  className="relative z-1050 w-full"
                  style={{ zIndex: 1000 }}
                >
                  <Dialog
                    as="div"
                    className="relative z-1050 w-5/6"
                    onClose={() => { }}
                    static={true}
                  >
                    <div
                      className="fixed inset-0 bg-black/30"
                      aria-hidden="true"
                    />
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto ">
                      <div className="flex min-h-full items-center justify-center p-4 text-center max-w-4xl mx-auto">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full px-7 transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                            <div className={`${!modal ? "hidden" : "block"}`}>
                              <div className="w-full">
                                <div className="w-full">
                                  <div className="my-3 w-3/4 md:w-full text-left flex ">
                                    <div className="w-full my-7">
                                      <Formik
                                        initialValues={{
                                          amount: item ? item.amount : " ",
                                        }}
                                        validate={async (values) => {
                                          const errors = {};

                                          if (!currency) {
                                            errors.currency = "Required";
                                          }

                                          if (!values.amount) {
                                            errors.amount = "Required";
                                          }

                                          return errors;
                                        }}
                                        onSubmit={async (values) => {
                                          if (item !== null) {
                                            const update =
                                              await updateCreditConverter({
                                                id: item._id,
                                                updates: {
                                                  currency: currency,
                                                  amount: values.amount,
                                                },
                                              });
                                            if (
                                              update &&
                                              update.status == 200
                                            ) {
                                              swal({
                                                title: "Success",
                                                text: "Category Updated Successfully",
                                                icon: "success",
                                                button: "Ok",
                                              });
                                              setCreditList(
                                                update.data.category
                                              );
                                            } else {
                                              swal({
                                                title: "Oops!",
                                                text: "Something Went Wrong",
                                                icon: "error",
                                                button: "Ok",
                                              });
                                            }
                                            setModal(false);
                                            setCurrency(
                                              currencies.currencies[0]
                                            );
                                            setItem(null);

                                            return;
                                          }
                                          const add = await addCreditConverter({
                                            currency: currency,
                                            amount: values.amount,
                                          });
                                          //console.log(add);
                                          setModal(false);
                                          if (add && add.status == 200) {
                                            swal({
                                              title: "Success",
                                              text: "Currency Added Successfully",
                                              icon: "success",
                                              button: "Ok",
                                            });
                                            let response =
                                              await ListCreditConverter();
                                            if (
                                              response &&
                                              response.status === 200
                                            ) {
                                              setCreditList(
                                                response.data.category
                                              );
                                            }
                                            setModal(false);
                                          } else {
                                            swal({
                                              title: "Oops!",
                                              text: "Something Went Wrong",
                                              icon: "error",
                                              button: "Ok",
                                            });
                                          }
                                          setCurrency(currencies.currencies[0]);
                                        }}
                                      >
                                        {({ values }) => (
                                          <Form>
                                            {/* <div className="flex flex-wrap w-full gap-y-5"> */}

                                            <div className="w-full my-5">
                                              <h2 className="font-semibold my-3">
                                                Currency
                                              </h2>
                                              <Listbox
                                                onChange={setCurrency}
                                                value={currency}
                                              >
                                                <div className="relative mt-1 w-full mb-5 z-100">
                                                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-4 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-blue-300 sm:text-sm border-1 border-">
                                                    <span className="block truncate">
                                                      {currency.symbol} -{" "}
                                                      {currency.name}
                                                    </span>
                                                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                                      <ChevronDownIcon
                                                        className="h-5 w-5 text-gray-400"
                                                        aria-hidden="true"
                                                      />
                                                    </span>
                                                  </Listbox.Button>
                                                  <Transition
                                                    as={Fragment}
                                                    leave="transition ease-in duration-100"
                                                    leaveFrom="opacity-100"
                                                    leaveTo="opacity-0"
                                                  >
                                                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-100">
                                                      {currencies.currencies.map(
                                                        (
                                                          currency,
                                                          currencyIdx
                                                        ) => (
                                                          <Listbox.Option
                                                            key={currencyIdx}
                                                            className={({
                                                              active,
                                                            }) =>
                                                              `relative cursor-default select-none py-2 pl-10 pr-4 ${active
                                                                ? "bg-blue-100 text-blue-900"
                                                                : "text-gray-900"
                                                              }`
                                                            }
                                                            value={currency}
                                                          >
                                                            {({ selected }) => (
                                                              <>
                                                                <span
                                                                  className={`block truncatez-100 ${selected
                                                                    ? "font-medium"
                                                                    : "font-normal"
                                                                    }`}
                                                                >
                                                                  {
                                                                    currency.symbol
                                                                  }{" "}
                                                                  -{" "}
                                                                  {
                                                                    currency.name
                                                                  }
                                                                </span>
                                                                {selected ? (
                                                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600 z-100">
                                                                    <CheckIcon
                                                                      className="h-5 w-5"
                                                                      aria-hidden="true"
                                                                    />
                                                                  </span>
                                                                ) : null}
                                                              </>
                                                            )}
                                                          </Listbox.Option>
                                                        )
                                                      )}
                                                    </Listbox.Options>
                                                  </Transition>
                                                </div>
                                              </Listbox>
                                              <ErrorMessage
                                                name="category"
                                                component="div"
                                                className="text-sm text-red-600"
                                              />
                                            </div>

                                            <div className="w-full my-5">
                                              <h2 className="font-semibold my-3">
                                                Amount
                                              </h2>
                                              <Field
                                                className="w-full rounded-lg border-gray-100"
                                                type="number"
                                                name="amount"
                                                placeholder="Enter Value"
                                                id=""
                                              />
                                              <ErrorMessage
                                                name="amount"
                                                component="div"
                                                className="text-sm text-red-600"
                                              />
                                            </div>

                                            <div className="w-full my-3">
                                              <button
                                                className="bg-[#034488] text-white rounded-sm px-4 py-1"
                                                type="submit"
                                                onClick={() => {
                                                  // setShowCategoryForm(true);
                                                }}
                                                style={{
                                                  backgroundColor: "#034488",
                                                  color: "#fff",
                                                }}
                                              >
                                                Submit
                                              </button>
                                            </div>
                                          </Form>
                                        )}
                                      </Formik>
                                    </div>
                                    <div>
                                      <button
                                        className="bg-[#034488] text-white rounded-sm py-1 my-2"
                                        onClick={() => {
                                          setModal(false);
                                          setItem(null);
                                          setCurrency(currencies.currencies[0]);
                                        }}
                                        style={{
                                          backgroundColor: "#fff",
                                          color: "#034488",
                                        }}
                                      >
                                        <ImCross />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col mx-10">
          <div className="overflow-x-auto w-full sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block w-full sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-white border-b">
                    <tr>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Currency
                      </th>

                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Amount(per $)
                      </th>

                      <th
                        scope="col"
                        className="lg:text-sm md:text-xs sm:text-[13px] font-medium text-gray-900 px-6 py-4 text-left"
                      ></th>
                    </tr>
                  </thead>
                  <tbody>
                    {creditList.map((item, index) => {
                      return (
                        <>
                          <tr
                            id={"AdminUserCrd" + (index + 1)}
                            className={
                              index < 5 ? "bg-gray-100" : "bg-gray-100 hidden"
                            }
                          >
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {index + 1}
                            </td>
                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              {item.currency.name}-{item.currency.code}
                            </td>

                            <td className="lg:text-sm md:text-xs sm:text-[10px] text-gray-900 font-light lg:px-6 md:px-3 sm:px-1 py-4 whitespace-nowrap">
                              {item.amount}
                            </td>

                            <td className="text-md flex text-blue-500 font-light py-4 whitespace-nowrap cursor-pointer">
                              <RiEditBoxLine
                                className="cursor-pointer"
                                onClick={() => {
                                  //  setEdit(index);
                                  setCurrency(item.currency);
                                  setItem(item);
                                  setModal(true);
                                }}
                              />
                              <AiOutlineDelete
                                className="text-red-600 cursor-pointer mx-3"
                                onClick={async () => {
                                  const update = await updateCreditConverter({
                                    id: item._id,
                                    updates: { isDeleted: true },
                                  });
                                  if (update && update.status == 200) {
                                    swal({
                                      title: "Success",
                                      text: "Category Deleted",
                                      icon: "success",
                                      button: "Ok",
                                    });
                                    setCreditList(update.data.category);
                                  } else {
                                    swal({
                                      title: "Oops!",
                                      text: "Something Went Wrong",
                                      icon: "error",
                                      button: "Ok",
                                    });
                                  }
                                }}
                              />
                            </td>
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
                <div className={creditList.length > 5 ? "w-full" : "hidden"}>
                  <div className="flex justify-between my-2 mx-1">
                    <div>
                      Page {page} of {Math.ceil(creditList.length / 5)}
                    </div>
                    <div>
                      {" "}
                      {creditList &&
                        creditList.map((user, index) => {
                          return index % 5 == 0 ? (
                            <span
                              className="mx-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                paginate(index / 5 + 1);
                              }}
                            >
                              {index / 5 + 1}
                            </span>
                          ) : null;
                        })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreditCategory;

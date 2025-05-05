import React from "react";
import { Link } from "react-router-dom";
import { getCompanyList, getUserFromId, getCreditInfoList, updateUserCreditInfo } from "../../service/api";
import { useNavigate } from "react-router-dom";
import ls from 'localstorage-slim';
import { getStorage, getSessionStorage, setSessionStorage, removeSessionStorage } from "../../service/storageService";



const CompanyList = () => {
  const [companyList, setCompanyList] = React.useState([]);

  React.useEffect(() => {
    const initial = async () => {
      let res = await getCompanyList({ user_type: "Company" });
      //console.log(res)
      if (res && res.status === 200) {
        setCompanyList(res.data.company);
      }
    };
    initial();
  }, []);

  const navigate = useNavigate();

  React.useState(() => {
    const initial = async () => {
      let user = JSON.parse(await getSessionStorage("user"));
      let res = await getUserFromId({ id: user._id }, user.access_token);
      if (res && res.data && res.data.user) {
        if (
          res.data.user.permissions[0].admin_permissions.list_companies === false
        ) {
          navigate(-1);
        }
      }
    };
    initial();
  }, []);

  return (
    <div className="p-5">
      <p className="text-2xl font-bold mx-10">Company List</p>
      <div className="mt-3">
        <div className="flex flex-col mx-10">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 inline-block w-full sm:px-6 lg:px-8">
              <div className="">
                <table className="w-full">
                  <thead className="bg-white border-b">
                    <tr>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        #
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Username
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Company Name
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Consumption Credit
                      </th>
                      <th
                        scope="col"
                        className="text-sm font-medium text-gray-900 px-6 py-4 text-left"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {companyList && companyList.map((user, index) => {
                      return (
                        <tr
                          key={index}
                          className={`${index % 2 === 0 ? "bg-gray-100" : "bg-white"
                            } border-b`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {index + 1}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {user.username}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {user.firstName} {user.lastName}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            {user.email}
                          </td>
                          <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                            <input
                              id="multiplier"
                              name="multiplier"
                              style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 4px 12px", borderRadius: "5px", }}
                              className="block border-gray-200 py-1 px-3 w-full"
                              value={user.defaultCredit}
                              onBlur={async (event) => {
                                //console.log(event.target.value);
                                let update = await updateUserCreditInfo({ id: user._id, updates: { defaultCredit: event.target.value } });
                                if (update.status == 200) {
                                  //console.log('done');
                                }
                              }}
                            >

                            </input>
                          </td>
                          <td className="text-xs text-blue-900 font-light px-6 py-4 whitespace-nowrap">
                            <Link to={`/admin/company/${user._id}`}>
                              View Detail
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyList;

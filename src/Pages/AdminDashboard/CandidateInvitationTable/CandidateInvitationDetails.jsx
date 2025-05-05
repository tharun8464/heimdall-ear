import React from 'react'

const CandidateInvitationDetails = ({candidates}) => {
  return (
    <div className="overflow-x-auto">
    <table className="w-full my-5 ">
      <thead className="bg-white border-b text-left">
        <tr>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            #
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Full Name
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Email
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Contact
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left">
            Status
          </th>
          <th
            scope="col"
            className="text-sm font-medium text-gray-900 px-6 py-4 text-left"></th>
        </tr>
      </thead>
      <tbody>
        {/* {console.log(
          "CANDIDATES-----------",
          candidate ? candidate : "NO CAND",
        )} */}
        {candidates.map((user, index) => {
          return (
            <tr
              id={"jobcrd" + (index + 1)}
              className={
                index < 5 ? "bg-gray-100" : "bg-gray-100 hidden"
              }>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-left">
                {index + 1}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                <a href="/">
                  {user.FirstName ? user.FirstName : user.firstName}{" "}
                  {user.LastName ? user.LastName : user.lastName}
                </a>
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                {user.Email ? user.Email : user.email}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                {user.Contact ? user.Contact : user.phoneNo}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap text-left">
                {user.Status}
              </td>

              {/* <td className="text-sm text-gray-900 font-light px-3 py-4 whitespace-nowrap text-left">
              <p className="text-sm font-semibold py-2">
                <Link
                  to={`/company/evaluationDetails/${user._id}`}
                  // to={`/user/printable`}
                >
                  View Details{" "}
                </Link>
              </p>{" "}
            </td> */}
              {/* <td className="text-sm text-blue-700 font-light px-3 py-4 whitespace-nowrap text-left">
              <p className="text-sm font-semibold py-2">
                <Link
                  to={`/company/CPrintAble/${user._id}`}
                  // to={`/company/CPrintable`}
                >
                  View Evaluation{" "}
                </Link>
              </p>{" "}
            </td> */}
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
  )
}

export default CandidateInvitationDetails
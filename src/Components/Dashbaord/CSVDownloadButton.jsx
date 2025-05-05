import React from 'react'
import { CSVLink } from 'react-csv'
import { IoMdDownload } from 'react-icons/io'
import { BarLoader } from 'react-spinners'

function CSVDownloadButton({pageData, fullCsvList, csvLoading, handleDownload, header, filename}) {
  return (
    <div className='flex flex-row items-center space-x-2'>
        {/* for single page download */}
		{/* <CSVLink headers={header} filename={`${filename}-page.csv`} data={pageData} className="group flex flex-row gap-2 items-center justify-between rounded-lg px-3 py-1 outline outline-green-700 border-green-700" style={{textDecorationLine: 'none'}}>
			<IoMdDownload className="w-6 h-6 font-bold text-lg text-green-700 group-hover:opacity-70" />
			<span className="text-lg text-green-700 font-bold group-hover:opacity-70">Download Page</span>
		</CSVLink> */}
        {/* for full page download */}
		{
            fullCsvList.length === 0  ? <button disabled={csvLoading} className='group flex flex-col gap-2 items-center justify-between rounded-lg px-3 py-1 outline outline-green-700 border-green-700' onClick={handleDownload}>
					<div className='flex flex-row gap-2'>
						<IoMdDownload className="w-6 h-6 font-bold text-lg text-green-700 group-hover:opacity-70" />
						<span className="text-lg text-green-700 font-bold group-hover:opacity-70">Export</span>
					</div>
						{
							csvLoading ? <BarLoader color="#228276" height={3} width={"100%"} /> : <></> 
						}
					</button> :
					<CSVLink data={fullCsvList} filename={`${filename}-all.csv`} headers={header} className="group flex flex-col gap-2 items-center justify-between rounded-lg px-3 py-1 outline outline-green-700 border-green-700" style={{textDecorationLine: 'none'}}>
							<div className='flex flex-row gap-2'>
								<IoMdDownload className="w-6 h-6 font-bold text-lg text-green-700 group-hover:opacity-70" />
								<span className="text-lg text-green-700 font-bold group-hover:opacity-70">Download</span>
							</div>
					</CSVLink>
        }
	</div>
  )
}

export default CSVDownloadButton
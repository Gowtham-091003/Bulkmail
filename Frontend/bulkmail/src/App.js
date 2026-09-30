import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

function App() {

  const [msg, setmsg] = useState("")
  const [status,setstatus]=useState(false)
  const [emaillists,setemaillists]=useState([])

  function handlemsg(evt)
  {
    setmsg(evt.target.value)
  }

  function handlesend() {
    setmsg("")
    setstatus(true)

    axios.post("http://localhost:5000/sendmail",{msg:msg,emaillists:emaillists}).then((item)=> {
      if (item.data === true) {
        alert("Email sent.")
        setstatus(false)
      }
      else {
        alert("Failed to sent a mail.")
        setstatus(false)

      }
    })
  }

  function handlefile(event) {
    
    const reqfile=event.target.files[0]
    // console.log(event)
    // console.log(reqfile)

    // Creating a Reader Object:
    const reader = new FileReader()

    // By default it will read in binary format:
    reader.readAsBinaryString(reqfile)

    // To check the excels are readed in binary format:
    reader.onload=function(event) {
      var binarycon=event.target.result
      // console.log(binarycon)
      // Making Binarycon into a readable content:
      const book=XLSX.read(binarycon,{type:"binary"})
      const sheetname=book.SheetNames[0]
      const sheet=book.Sheets[sheetname]
      const emaillist=XLSX.utils.sheet_to_json(sheet,{header:'A'})
      const totalemaillist=emaillist.map((event)=> {return(event.A)})
      console.log(totalemaillist)
      setemaillists(totalemaillist)
    } 
  }

  return (
    <div>

      <div className="bg-blue-950 text-white text-center">
        <h1 className="text-2xl font-medium px-5 py-3">BulkMail</h1>
      </div>

      <div className="bg-blue-800 text-white text-center">
        <h1 className="font-medium px-5 py-3">
          We can help your business with sending multiple mails
        </h1>
      </div>

      <div className="bg-blue-600 text-white text-center">
        <h1 className="font-medium px-5 py-3">Drag and Drop</h1>
      </div>

      <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">

        <textarea
          className="w-[80%] h-32 py-2 outline-none px-2 border border-black rounded-md"
          onChange={handlemsg}
          value={msg}
        />

        <div>
          <input
            onChange={handlefile}
            type="file"
            className="border-4 border-dashed py-4 px-4 mt-5 mb-5"
          />
        </div>

        <p>Total Emails in the file: {emaillists.length}</p>

        <button className="mt-2 bg-blue-950 py-2 px-2 text-white font-medium rounded-md" onClick={handlesend}>
          {status?"Sending":"Send"}
        </button>

      </div>

    </div>
  );
}

export default App;
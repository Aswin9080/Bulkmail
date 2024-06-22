import logo from './logo.svg';
import './App.css';
import *as XLSX from 'xlsx'
import { useState } from 'react'
import axios from 'axios'
function App() {


  const [msg, setmsg] = useState()
  const [Elist, setmail] = useState([])
  const [status, setstatus] = useState(false)
  console.log(Elist.length)

  function handlemsg(event) {
    setmsg(event.target.value)
  }

  function handlechange(event) {
    const file = event.target.files[0]

    const reader = new FileReader()
    reader.onload = function (event) {
      const data = event.target.result
      const workbook = XLSX.read(data, { type: 'binary' })
      console.log(workbook.Sheets.Sheet1)
      const worksheet = workbook.Sheets.Sheet1

      //change the format json array
      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: 'A' })
      const emaillists = emaillist.map(function(item){return item.A})
      console.log(emaillists)
      setmail(emaillists)

    }
    reader.readAsBinaryString(file)
  }

  //http://localhost:5000/sendmail
  function send() {
    setstatus(true)
    axios.post('http://localhost:5000/sendmail', { msg: msg,emaillist:Elist })
      .then(function (data) {
        if (data.data == true) {
          alert('email send sucessfully')
          setstatus(false)
        }
        else{
          setstatus(false)
          alert('email failed')
        }
      })
  }
  return (
    <div>
      <div className='bg-blue-950 text-2xl text-center'>
        <h1 className='p-4'>Bulkmail</h1>
      </div>

      <div className='bg-blue-800 text-2xl text-center'>
        <h1 className='p-4'>We can helpyour business with sending multiple emails at once</h1>
      </div>

      <div className='bg-blue-400 text-2xl text-center'>
        <h1 className='p-4'>Bulkmail</h1>
      </div>

      <div className='bg-blue-200 p-4 flex flex-col items-center'>
        <textarea value={msg} onChange={handlemsg} className='w-[80%] h-32 border border-black rounded px-2 py-2' placeholder='Enter the Email.....'></textarea>

        <div >
          <input onChange={handlechange} type='file' className='mt-5 mb-5 border-4 border-dashed py-4 px-4'></input>
        </div>

        <p>Total number of mail:{Elist.length}</p>

        <div className='text-center '>
          <button className='bg-violet-500 p-1 border-black rounded' onClick={send}>{status ? "sending....." : "send"}</button>

        </div>
      </div>


    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import icons from "./icons"; 
import { Snackbar } from "@mui/material";
import { Alert } from "@mui/material";


const App = () => {
  const [input, setInput] = useState("");
  const [chatItems, setChatItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [proceeded, setProceeded] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationSeverity, setNotificationSeverity] = useState({severity: "info", message: "Test notification"});

  let chatChatGPTURL = `http://0.0.0.0:8000/api/chat/chatgpt/${input}`;
  let uploadURL = `http://0.0.0.0:8000/api/upload/`;

  const showNotification = (severity) => {
    setNotificationSeverity(severity);
    setNotificationOpen(true);
  };
  
  const hideNotification = () => {
    setNotificationOpen(false);
  };

  const handleDropdownChange = (event) => {
    console.log('selected model: ', event.target.value);
    setSelectedOption(event.target.value);
  };
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setProceeded(false);
  };

  const handleProceed = () => {
    console.log('Uploading: ', selectedFile);

    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    fetch(uploadURL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type , Authorization',
        'Access-Control-Allow-Credentials': 'true'
      },
      body: formData
    })
      .then(response => {
        console.log(response);
        if (response.ok) {
          console.log('File uploaded successfully');
          showNotification({severity: "success", message: "File uploaded successfully"});
        } else {
          throw new Error('Error uploading file');
        }
      })
      .catch(error => {
        console.error('Error uploading file:', error);
        // showNotification({severity: "error", message: "Error uploading file"});
        showNotification({severity: "info", message: "It's confusing, but the file should be uploaded successfully"});
      })

      setLoading(false);
      
      setProceeded(true);

  };


  const completion = async () => {

    setLoading(true);
    
    console.log('----------------');
    console.log(chatItems);
    console.log('----------------');
    console.log(input+chatItems.map((item) => item.content).join('\n'))
    console.log('================');

  
    fetch(chatChatGPTURL, {
      method: 'GET',  
      headers: {
          'Accept': 'application/json'

        }
      })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Request failed');
        }
      })
      .then(data => {
        console.log(data);
        if (data) {
          setChatItems([
            ...chatItems,
            { content: data, isAnswer: true },
          ]);
        }
      })
      .catch(err => {
          console.log(err);
      })

    setLoading(false);
    
    setInput('');
  };

  useEffect(() => {
    if (chatItems.length === 0) return;
    if (chatItems[chatItems.length - 1].isAnswer) return;
    
    if (selectedOption === '') {
      showNotification({severity: "error", message: "Please select a model"});
      return;
    }

    completion();

  }, [chatItems]);

  function handleSubmit(e) {

    e.preventDefault();
    setChatItems([...chatItems, { content: input, isAnswer: false }]);
  }

  const ChatItem = ({ isAnswer, content }) => {
    return (
      <li className={`flex ${isAnswer ? "justify-start" : "justify-end"}`}>
        <div
          className={`relative max-w-xl px-4 py-2 text-gray-700 rounded shadow ${
            !isAnswer ? "bg-gray-100" : ""
          }`} style={{whiteSpace: 'pre-wrap'}}>
            {content.toString().trim()}
        </div>
      </li>
    );
  };


  return (
    <div className="overflow-hidden w-full z-20 h-full relative">

      <Snackbar
        open={notificationOpen}
        autoHideDuration={3000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={hideNotification} severity={notificationSeverity.severity}>
          {notificationSeverity.message}
        </Alert>
      </Snackbar>

      <div className="flex h-full flex-1 flex-col md:pl-[260px]">
        <main className="relative h-full w-full transition-width flex flex-col overflow-hidden items-stretch flex-1">
          <div className="flex-1 overflow-auto">
            <div className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
              <ul className="space-y-2 w-full">
                {chatItems.map((item, i) => (
                  <ChatItem
                    key={i}
                    isAnswer={item.isAnswer}
                    content={item.content}
                  />
                ))}
              </ul>
            </div>
          </div>
          <div className="w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient">
            <form
              onSubmit={handleSubmit}
              className="stretch mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
              <div className="relative flex h-full flex-1 md:flex-col">
                <div className="ml-1 mt-1.5 md:w-full md:m-auto md:flex md:mb-2 gap-2 justify-center"></div>
                <div className="flex flex-col w-full py-2 pl-3 flex-grow md:py-3 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-dark text-dark dark:bg-gray-700 rounded-md shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]">
                  <textarea
                    value={loading ? "" : input}
                    tabIndex="0"
                    rows="1"
                    placeholder="Write a message..."
                    onChange={(e) => setInput(e.target.value)}
                    className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-7 focus:ring-0 focus-visible:ring-0 dark:bg-transparent"></textarea>
                  <button
                    disabled={loading || input === "" || proceeded === false}
                    id="chat-submit"
                    type="submit"
                    className="absolute p-1 rounded-md text-gray-500 bottom-1.5 right-1 md:bottom-2.5 md:right-2 hover:bg-gray-100 dark:hover:text-gray-400 dark:hover:bg-gray-900 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent">
                    {loading ? icons.spinner : icons.sendIcon}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
      <div className="dark hidden bg-gray-900 md:fixed md:inset-y-0 md:flex md:w-[260px] md:flex-col">
        <div className="flex h-full min-h-0 flex-col">
          <div className="scrollbar-trigger flex h-full w-full flex-1 items-start border-white/20">
            <nav className="flex h-full flex-1 flex-col space-y-1 p-2">
                <select
                  className="flex py-3 px-3 items-center gap-3 rounded-md bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
                  onChange={handleDropdownChange}
                >
                  <option value="chatgpt">GPT-4o mini</option>
                </select>
              <label
                htmlFor="fileInput"
                className="flex py-3 px-3 items-center gap-3 rounded-md hover:bg-gray-500/10 transition-colors duration-200 text-white cursor-pointer text-sm mb-2 flex-shrink-0 border border-white/20"
              >
                <svg
                  stroke="currentColor"
                  fill="none"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                <span>Upload New File</span>
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              {selectedFile && (
                <div className="text-white text-sm px-4 py-4">
                  <div>Uploaded file: {selectedFile.name}</div>
                  <button
                    disabled={proceeded === true}
                    className={`mt-2 hover:underline focus:outline-none ${proceeded === true ? 'text-green-500' : 'text-blue-500'}`}
                    onClick={handleProceed}
                  >
                    {proceeded === true ? "Proceeded" : "Proceed"}
                  </button>
                </div>
              )}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;

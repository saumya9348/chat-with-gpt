import React from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,Input,Button,Textarea,Avatar,IconButton,ButtonGroup,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem, 
} from "@material-tailwind/react";
import { Configuration, OpenAIApi } from 'openai';

const API_KEY = "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";

export function Notifications() {
  const configuration = new Configuration({
      apiKey: API_KEY,
  });
  const openai = new OpenAIApi(configuration)

  const [question, setQuestion] = React.useState("")
  const [storedValues, setStoredValues] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const copyText = (text) => {
    navigator.clipboard.writeText(text);
  };
  const handleSubmit = async (e,t) =>{
    e.preventDefault();
    if(!question){
      alert("email required")
      return;
    }
    let options = {
        model: 'text-davinci-003',
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ['/'],
    };

    let completeOptions = {
        ...options,
        prompt: t + question,
    };
    setLoading(true)
    const response = await openai.createCompletion(completeOptions);
    if(response.data.choices[0].text){
      setStoredValues([
        ...storedValues,

        {
            question: question,
            answer: response.data.choices[0].text,
        },
    ]);
    setQuestion("");
    }
    setLoading(false)

  }
  return (
    <div className={loading?"cursor-wait":""}>
      <div className="mx-8 my-6 flex  flex-col gap-8 ">
        <Card>
          <CardHeader
            color="transparent"
            floated={false}
            shadow={false}
            className="m-0 p-4"
          >
            <Typography variant="h5" color="blue-gray">
              ChatGPT
            </Typography>
          </CardHeader>
          <CardBody className="flex flex-col gap-4 p-4 px-10">
            <div className="h-[600px] overflow-y-auto">
              {
              storedValues.length==0?                        
              <div className="text-2xl bg-gray-200 mt-2 p-3 rounded-r-3xl rounded-bl-3xl">I'm a ChatGPT, How can I assist you?</div>
              :
              storedValues.map((value, index) => {
                  return (
                    <div className="mt-2 pr-3" key={index}>
                      <div className="flex flex-col items-end">
                        <div className="flex flex-row">
                          <div className="text-right text-xl bg-blue-400 text-white p-3 rounded-l-2xl rounded-br-2xl">
                            {value.question}
                          </div>
                          <Avatar
                            src={'/img/user.jpg'}
                            alt={'user'}
                            size="md"
                            variant="circular"
                            className={`cursor-pointer border-2 border-white`}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex flex-row">
                         <Avatar
                            src={'/img/bot.jpg'}
                            alt={'user'}
                            size="xl"
                            variant="circular"
                            className={`cursor-pointer border-2 border-white`}
                          />
                          <div className="text-xl bg-gray-200 mt-2 p-3 rounded-r-3xl rounded-bl-3xl flex flex-row">
                            <div>
                              {value.answer}
                            </div>
                            <IconButton 
                              variant="text" 
                              size="lg" 
                              onClick={() => copyText(value.answer)}
                            >
                                <i className="fa-solid fa-copy"></i>
                            </IconButton >
                          </div>
                          
                        </div>
                      </div>
                    </div>
                  );
              })}
            </div>
            <div className="flex flex-row">
              <div className="basis-11/12">
              <Textarea  type="text" label="Question" size="lg" disabled={loading}
              value={question} onChange={e=>setQuestion(e.target.value)}
              // onKeyDown={e=>e.keyCode==13?handleSubmit(e,""):""}
              />
              </div>
              <div className="basis-1/12 px-2 flex pb-3 items-end">
                  <button variant="gradient" className={loading?"cursor-not-allowed bg-blue-500 rounded-l-3xl text-white text-center p-2":"bg-blue-500 rounded-l-3xl text-white text-center p-2"} fullWidth  onClick={(e) => handleSubmit(e,"")}>
                    Send
                  </button>
                  <Menu>
                    <MenuHandler>
                    <button className="bg-blue-500 rounded-r-3xl border-l-[1px] text-white text-center p-2">
                      <i className="fas fa-arrow-down" />
                    </button>
                    </MenuHandler>
                    <MenuList>
                      <MenuItem 
                        onClick={(e) => handleSubmit(e, "Correct Write")}
                      >
                        Grammer
                      </MenuItem>
                      
                      <MenuItem 
                        onClick={(e) => handleSubmit(e, "Explain it")}
                      >
                        Explain
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => handleSubmit(e,"Create a list of 8 questions for my interview with a ")}
                      >
                        Interview
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => handleSubmit(e, "Translate to chinese")}
                      >
                        Chinese
                      </MenuItem>
                      <MenuItem
                        onClick={(e) => handleSubmit(e, "Translate to english")}
                      >
                        Engl ish
                      </MenuItem>
                    </MenuList>
                  </Menu>
              </div>
            </div>
          </CardBody>
        </Card>

      </div>
      </div>
  );
}

export default Notifications;

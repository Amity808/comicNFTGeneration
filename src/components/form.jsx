import axios from 'axios'
import React, { useState } from 'react'
import { NFTStorage, File } from 'nft.storage'

import { Buffer } from 'buffer';


const Form = () => {
  const [name, setName] = useState("")
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const submitHandler = async (e) => {
    // Your code here to create and mint the NFT
    e.preventDefault()

    
    const imageData = createImage()
  }

  const createImage = async () => {
    console.log("generating image")

    const URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large"

    const response = await axios({
      url: URL,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
        Accept: "application/json",
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        inputs: description,
        option: { wait_for_model: true },
      }),
      responseType: 'arraybuffer',
    });
    
    const type = response.headers['content-type'];
    const data = response.data;
    
    if (!data) {
      throw new Error("No data received from the API");
    }
    
    const base64data = Buffer.from(data).toString('base64');
    const img = `data:${type};base64,` + base64data;
    setImage(img);
    return data;
    

  }

  const updloadImage = async (imageData) => {
    console.log("uploading image")
    const uploadnftStorage = new NFTStorage({ token: process.env.REACT_APP_NFT_STORAGE_API_KEY })

    const {ipNFT } = await uploadnftStorage.store({
      
    })
  }
  return (
    <div>
      <div className='form'>
      <form onSubmit={submitHandler}>
        <input type='text' placeholder='Create comic name' onChange={(e) => {setName(e.target.value)}}/>
        <input type='text' placeholder='Comic description'  onChange={(e) => {setDescription(e.target.value)}}/>
        <input type="submit" value={"Create & mint"} />

      </form>

      <div className='image'>
        <img src={image} alt="AI Generated Image" />
      </div>
    </div>
    <p>View&nbsp;<a href="" target='_blank'>Metadata</a></p>
    </div>
  )
}

export default Form

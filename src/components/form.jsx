import axios from "axios";
import React, { useState } from "react";
// import { NFTStorage, File } from "nft.storage";
import { Buffer } from "buffer";

import { PinataSDK } from "pinata-web3";

const pinata = new PinataSDK({
  pinataJwt: process.env.REACT_APP_PINTA_JWT,
  pinataGateway: process.env.REACT_APP_PINTA_API_KEY_DOMAIN,
});

const Form = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState(null);
  const submitHandler = async (e) => {
    // Your code here to create and mint the NFT
    e.preventDefault();

    const imageData = await createImage();
    // const url = await updloadImage(imageData)

    const pinta = await uploadToPinta(imageData);

    console.log("pinta", pinta);
    // console.log(url, "url");
  };

  const createImage = async () => {
    console.log("generating image");

    const URL =
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large";

    const response = await axios({
      url: URL,
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.REACT_APP_HUGGING_FACE_API_KEY}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        inputs: description,
        option: { wait_for_model: true },
      }),
      responseType: "arraybuffer",
    });

    const type = response.headers["content-type"];
    const data = response.data;

    if (!data) {
      throw new Error("No data received from the API");
    }

    const base64data = Buffer.from(data).toString("base64");
    const img = `data:${type};base64,` + base64data;
    setImage(img);
    return data;
  };

  const uploadToPinta = async (imageData) => {
    console.log("uploading image");
    try {
      const file = new File([imageData], "image.jpeg", { type: "text/plain" });
      const upload = await pinata.upload.file(file);
      console.log(upload);
      console.log("upload complete");
      const uploadhash = await upload.IpfsHash
      const uploadJson = await pinata.upload.json({
        name: name,
        description: description,
        image: `ipfs://${uploadhash}`,
        external_url: "https://pinata.cloud"
      })
      const url = `https://gold-thorough-bobolink-856.mypinata.cloud/ipfs/${uploadJson.IpfsHash}`

      setUrl(url);
      return uploadJson;
    } catch (error) {
      console.log(error);
    }
  };
  console.log(url, "url");

  

  

  return (
    <div>
      <div className="form">
        <form onSubmit={submitHandler}>
          <input
            type="text"
            placeholder="Create comic name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            type="text"
            placeholder="Comic description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
          <input type="submit" value={"Create & mint"} />
        </form>

        <div className="image">
          <img src={image} alt="AI Generated Image" />
        </div>
      </div>
      <p>
        View&nbsp;
        <a href={url} target="_blank">
          Metadata
        </a>
      </p>
    </div>
  );
};

export default Form;

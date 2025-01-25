import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Form from './components/form';
// Components
import Spinner from 'react-bootstrap/Spinner';
import Navigation from './components/Navigation';
import NFTAbi from './abis/NFT.json'
import config from './config.json';


function App() {
  const [provider, setProvider] = useState(null)
  const [account, setAccount] = useState(null)
  const [contract, setContract] = useState(null)

  const NFTAddress = ""


  const loadBlockchainData = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    const network = await provider.getNetwork()
    const comicNft = new ethers.Contract(config[network.chainId].nft.address, NFTAbi, provider)
    setContract(comicNft)

    // const name = await comicNft.name()
    
  }

  

  useEffect(() => {
    loadBlockchainData()
  }, [])

  return (
    <div>
      <Navigation account={account} setAccount={setAccount} />
      <Form provider={provider} contract={contract} />

    </div>
  );
}

export default App;

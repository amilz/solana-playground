//~~~IMPORTS 
import * as solanaWeb3 from '@solana/web3.js';
import Wallet from '@project-serum/sol-wallet-adapter';
import { Connection, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';




//~~~VARIABLES
let netselect = 'devnet'; //mainnet-beta OR devnet
let status = 'disconnected';//use this to toggle 
let solletwallet = new Wallet('https://www.sollet.io');
let connectedWalletID = ''; //public wallet ID of connected wallet
let connectedWalletType = ''; //phantom or sollet
let conn = new Connection(clusterApiUrl(netselect)); //mainnet-beta //devnet


//~~~FORMULAS
const SOLsearch = async function (item,index,arry) { 
  const pubkey = new solanaWeb3.PublicKey(item);
  const balance = await conn.getBalance(pubkey) / 1000000000; 
  console.log('Balance : '+ balance + ' SOL');
  return balance;
}

//run on any connection (after the .on)
const connectWallet = async (wallettype) => {
  connectedWalletType = wallettype;
  status='connected';
  console.log("Connected to: "+connectedWalletID); //prints wallet ID
  document.getElementById("connectedwalletfield").innerHTML = "Connected to: "+connectedWalletID   +"<BR>";    
  toggleConnectButton(status);
  let solbalance = await SOLsearch(connectedWalletID);  
  document.getElementById("connectedwalletfield").innerHTML += "$SOL Balance: " + solbalance;    
}

//discconect function
const disconnectWallet = async () => {
  console.log('Disconnected');
  status = 'disconnected';
  connectedWalletType = '';
  toggleConnectButton(status);
  document.getElementById("connectedwalletfield").innerHTML = "Disconnected from "+connectedWalletID+"!";    
};


//~~~BUTTONS
let toggleConnect= false; //toggle value for connect button

// Connect Wallet Button opens up the list of options (or closes options)
document.getElementById("connectbutton").onclick =  () => {
  if (!toggleConnect){
    document.getElementById("connectPop").style.display = "block";
    toggleConnect= true;
  }
  else {
    closeConnect();
  }
} 

//this will switch connect to DC (and vis versa) when connected/disconnected); must define status and call it into this function
const toggleConnectButton = (currentstatus) => {
  if (currentstatus === 'connected'){
    document.getElementById("connectbutton").style.display = "none";
    document.getElementById("disconnectbutton").style.display = "block"; 
  }
  else {
    document.getElementById("connectbutton").style.display = "block";
    document.getElementById("disconnectbutton").style.display = "none"; 
  }
}

//phantom button 
document.getElementById("phantombutton").onclick = async () => {
  closeConnect(); //close the popup
  //disconnectWallet(); // first DC anything that's open
  window.solana.connect(); //connect to phantom
}
//sollet button
document.getElementById("solletbutton").onclick = async () => {
  closeConnect(); //close the popup
  //disconnectWallet(); // first DC anything that's open
  await solletwallet.connect(); //connect to sollet
}

//disconnect button
document.getElementById("disconnectbutton").onclick =  async () => {
  //disconnect sollet 
  await solletwallet.disconnect();
  //disconnect phantom
  window.solana.disconnect();
}

//hide the connect wallet pop-up
const closeConnect = () =>{
  document.getElementById("connectPop").style.display = "none";
  toggleConnect= false; 
}

// Network Select Button
document.getElementById("net-toggle").onclick =  () => {
  closeConnect();
  if (netselect === 'devnet'){
    document.getElementById("net-toggle").innerHTML = "Main Net"
    netselect = 'mainnet-beta';
  }
  else {
    document.getElementById("net-toggle").innerHTML = "Dev Net"
    netselect = 'devnet';
  }
} 


//~~~WALLET ONCONNECTS

//sollet connection
solletwallet.on('connect',  async (publicKey)  =>  {
  connectedWalletID = publicKey.toBase58();
  connectWallet('sollet');
  
  }
);
solletwallet.on('disconnect', () => {
  disconnectWallet();
  }
);

//phantom - check that phantom is installed
const isPhantomInstalled = window.solana && window.solana.isPhantom; 
const getProvider = () => {
    if ("solana" in window) {
      const provider = window.solana;
      if (provider.isPhantom) {
        return provider;
        console.log(provider);
      }
    }
    window.open("https://phantom.app/", "_blank");
};
//phantom connection
window.solana.on("connect", async () => {
  connectedWalletID = window.solana.publicKey.toString(); //defines the public walletID
  connectWallet('phantom');

});
window.solana.on('disconnect', () => {
  disconnectWallet();
});



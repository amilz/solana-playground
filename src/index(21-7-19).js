//imports 
import * as solanaWeb3 from '@solana/web3.js';
    //import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import Wallet from '@project-serum/sol-wallet-adapter';
import { Connection, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import "./styles.css";

//import {GrabStakeAccts} from "./solstake"; HOW DO I?! it's getting hung up on conn, Solanaweb3, and stakekey
const GrabStakeAccts = async function (pubwallet) {     
  const stakelist = await conn.getParsedProgramAccounts(stakekey, 
      {filters: 
        [ //some guy on discord thinks you can just skip datasize. previously i had {dataSize: 200}
        {memcmp: {offset: 44, bytes: pubwallet}} //i'd gotten this to work with offset 12 also
        ]
      }
  );
  //stakelist.forEach((account, index, acctlist) => StakeAdder(account, pubwallet));
  stakelist.forEach((account, index, acctlist) => StakeAdder(account));
}
var StakeAdder = function(element) {
  console.log('mainnet staked amount: '+element.account.lamports /1000000000 + ' SOL' );
}


//define variables 
const SOLSEARCH = async function (item,index,arry) { 
    const pubkey = new solanaWeb3.PublicKey(item);
    const balance = await conn.getBalance(pubkey) / 1000000000; 
    console.log('Balance : '+ balance + ' SOL');
    return balance;
}
let netselect = 'devnet';
let walletCapture = '';
let connection = new Connection(clusterApiUrl(netselect)); //mainnet-beta //devnet
let providerUrl = 'https://www.sollet.io';
let wallet = new Wallet(providerUrl);

//establish solanaconnection
const conn = new solanaWeb3.Connection('https://api.mainnet-beta.solana.com');
const TokenKey = new solanaWeb3.PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
const stakekey = new solanaWeb3.PublicKey('Stake11111111111111111111111111111111111111'); 

//buttons
document.getElementById("TestButton1").onclick = async () => {
    connect2sollet();
 } 
document.getElementById("TestButton2").onclick = async () => {
    window.solana.disconnect();
} 
document.getElementById("TestButton3").onclick = async () => {
    window.solana.connect();
} 
document.getElementById("TestButton4").onclick = async () => {
    
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new solanaWeb3.PublicKey('5tPMhSJAEcdybJ1BQ8vnGpxUwEvKWdWPyo8tCkAAh93T'),
        lamports: 1000000000,
      })
    );
    let { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
    let signed = await wallet.signTransaction(transaction);
    let txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid);
    
} 
document.getElementById("TestButton5").onclick = async () => {
    
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: window.solana.publicKey,
        toPubkey: new solanaWeb3.PublicKey('FoZ6TbVp5aRv2xcSL4bf79zQrC87iAkg9VWVfj9pRhQc'),
        lamports: 100,
      })
    );
    let { blockhash } = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = window.solana.publicKey;
    let signed = await window.solana.signTransaction(transaction);
    let txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid);
    
} 
document.getElementById("netdropdown").onclick = async () => {
    netselect = document.getElementById("netdropdown").options[document.getElementById("netdropdown").selectedIndex].value;
    console.log('active network: ' + netselect);
} 
document.getElementById("TestButton6").onclick = async () => {
    console.log(contestents[Math.floor(Math.random()*contestents.length)]);

} 

//sollet connection

wallet.on('connect', publicKey => 
        {console.log('Connected to ' + publicKey.toBase58());
        walletCapture = publicKey.toBase58();
        console.log("Wallet Address: "+walletCapture); //prints wallet ID
        SOLSEARCH(walletCapture);//finds SOL balance & prints console log
    
        }

    );
wallet.on('disconnect', () => console.log('Disconnected'));

const connect2sollet = async function () {
    await wallet.connect();
}


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

//when connect to solana
window.solana.on("connect", async () => {
    console.log("Connected!");
    walletCapture = window.solana.publicKey.toString(); //defines the public walletID
    console.log("Wallet Address: "+walletCapture); //prints wallet ID
    let solbalance = await SOLSEARCH(walletCapture);//finds SOL balance & prints console log
    document.getElementById('connectionstatus').innerText = 'Connected to ' + walletCapture +'; Balance: '+solbalance;
    GrabStakeAccts(walletCapture);

});

//disconnects phantom
window.solana.on('disconnect', () => {
    console.log("disconnected!");
    document.getElementById('connectionstatus').innerText = 'Wallet Disconnected!';

});

//Phantom Transaction
const createTransferTransaction = async () => {
    /*if (!provider.publicKey) {
      return;
    }*/
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: walletCapture,
        toPubkey: '5tPMhSJAEcdybJ1BQ8vnGpxUwEvKWdWPyo8tCkAAh93T',
        lamports: 100
      })
    );
    let { blockhash } = await this.connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = walletCapture;
    let signed = await senderWallet.signTransaction(transaction);
    let txid = await this.connection.sendRawTransaction(signed.serialize());
    await this.connection.confirmTransaction(txid);
}
const makeTransaction = async () => {
    
    let transaction =  new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: walletCapture,
          toPubkey: '5tPMhSJAEcdybJ1BQ8vnGpxUwEvKWdWPyo8tCkAAh93T',
          lamports: 100
        }))
     console.log(transaction);
     let { blockhash } = await this.connection.getRecentBlockhash();
     transaction.recentBlockhash = blockhash;
     transaction.feePayer = walletCapture;
     let signed = await senderWallet.signTransaction(transaction);
     let txid = await this.connection.sendRawTransaction(signed.serialize());
     await this.connection.confirmTransaction(txid);
}


/* LINKS:
Phantom: https://docs.phantom.app/integrating/establishing-a-connection
LEft off here: 
https://github.com/phantom-labs/sandbox/blob/main/src/App.tsx
https://docs.phantom.app/integrating/sending-a-transaction
https://codesandbox.io/s/github/phantom-labs/sandbox?file=/src/App.tsx




*/
const contestents = ['blumber','muhammed','mrFro','firmin','adesoye','chris'];

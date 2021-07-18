
const conn = new solanaWeb3.Connection('https://api.mainnet-beta.solana.com');
const stakekey = new solanaWeb3.PublicKey('Stake11111111111111111111111111111111111111'); 


//this will ping solana and find the balance of each staking account based on a public ID
export const GrabStakeAccts = async function (pubwallet) {     
    const stakelist = await conn.getParsedProgramAccounts(stakekey, 
        {filters: 
          [ //some guy on discord thinks you can just skip datasize. previously i had {dataSize: 200}
          {memcmp: {offset: 44, bytes: pubwallet.walletID}} //i'd gotten this to work with offset 12 also
          ]
        }
    );
    //stakelist.forEach((account, index, acctlist) => StakeAdder(account, pubwallet));
    console.log(stakelist);
}


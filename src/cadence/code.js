export const mintNFTTx = `
  import HolidaysNFT from 0x2e983469d9331d80

  transaction(image: String, name: String) {

    prepare(acct: AuthAccount) {
      if acct.borrow<&HolidaysNFT.Collection>(from: /storage/HolidayNFTCollection) == nil {
        acct.save(<- HolidaysNFT.createEmptyCollection(), to: /storage/HolidayNFTCollection)
        acct.link<&HolidaysNFT.Collection{HolidaysNFT.CollectionPublic}>(/public/HolidaysNFTCollection, target: /storage/HolidayNFTCollection)
      }

      let nftCollection = acct.borrow<&HolidaysNFT.Collection>(from: /storage/HolidayNFTCollection)!

      nftCollection.deposit(token: <- HolidaysNFT.mintNFT(image: image, name: name))
    }

    execute {
      log("Minted an NFT")
    }
  }
`

export const viewNFTScript = `
  import HolidaysNFT from 0x2e983469d9331d80

  pub fun main(account: Address): [String] {

    let nftCollection = getAccount(account).getCapability(/public/HolidaysNFTCollection)
                          .borrow<&HolidaysNFT.Collection{HolidaysNFT.CollectionPublic}>()
                          ?? panic("this nft Colleciton does not exist.")

    // info will contain the name and the image hash

    let info: [String] = []

    let nftRef = nftCollection.borrowEntireNFT(id: nftCollection.getIDs()[0])
    info.append(nftRef.image)
    info.append(nftRef.name)

    return info

  }
`
import * as bip39 from 'bip39'

const Bip39Manager = () => {
  // Function to get createMnemonic
  const createMnemonic = (isTestMode: boolean) => {
    let mnemonic = isTestMode
      ? 'faint record mad siren effort before surface strategy return rubber detail dune'
      : bip39.generateMnemonic()
    return mnemonic
  }

  const getSeedUsingMnemonic = (mnemonic: string) => {
    const seed = bip39.mnemonicToSeedSync(mnemonic, '') // (mnemonic, password)
    return seed
  }
  const isMnemonicValid = (mnemonic: string) => {
    return bip39.validateMnemonic(mnemonic)
  }

  return {
    createMnemonic,
    getSeedUsingMnemonic,
    isMnemonicValid,
  }
}

export default Bip39Manager

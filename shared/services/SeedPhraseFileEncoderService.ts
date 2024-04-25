import ReedSolomonErasure from '../algorithms/reedSolomonErasure'
import * as reedSolomonErasureCore from '../algorithms/reedSolomonErasureCore.js'
import EncryptionService from './EncryptionService'

const DATA_SHARDS = 2
const PARITY_SHARDS = 1
const EncodeDataAndStoreDataToFile = async (mnemonic: string, password: string) => {
  const tempObj = new ReedSolomonErasure(reedSolomonErasureCore)
  let test = Buffer.from(mnemonic, 'utf8').toJSON()
  let adjustmentArray = test.data
  const empty_bytes = adjustmentArray.length % DATA_SHARDS
  let adjustment_bytes = 0
  if (empty_bytes > 0) {
    adjustment_bytes = DATA_SHARDS - empty_bytes
  }
  for (let i = 0; i < adjustment_bytes; i++) {
    adjustmentArray.push(0)
  }

  const SHARD_SIZE = adjustmentArray.length / DATA_SHARDS
  console.log(
    `Data Shards: ${DATA_SHARDS}, Parity Shards : ${PARITY_SHARDS}, Shard size:${SHARD_SIZE}`,
    typeof SHARD_SIZE
  )

  const input = new Uint8Array(adjustmentArray)
  //Encode data
  const shards = new Uint8Array(SHARD_SIZE * (DATA_SHARDS + PARITY_SHARDS))
  shards.set(input.slice())
  tempObj.encode(shards, DATA_SHARDS, PARITY_SHARDS)
  const dataFile = shards.slice()
  const loopVal = Math.ceil(dataFile.length / SHARD_SIZE)
  const encryptedFinalDataArr = []
  for (let i = 0; i < loopVal; i++) {
    const chunkStart = i * SHARD_SIZE
    const chunkEnd = chunkStart + SHARD_SIZE
    const fileContent = dataFile.slice(chunkStart, chunkEnd)
    let shardArray: any[] = []
    for (let i = 0; i < SHARD_SIZE; i++) {
      shardArray[i] = fileContent[i]
    }
    const fileData = {
      position: i,
      data_shards: DATA_SHARDS,
      parity_shards: PARITY_SHARDS,
      shard_size: SHARD_SIZE,
      data: shardArray.toString(),
    }
    const encryptedData = await EncryptionService().encrypt(JSON.stringify(fileData), password)
    // @ts-ignore
    encryptedFinalDataArr.push(JSON.stringify(encryptedData))
  }
  return encryptedFinalDataArr
}

export default EncodeDataAndStoreDataToFile

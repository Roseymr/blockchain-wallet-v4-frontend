import { takeLatest } from 'redux-saga/effects'

import wallet from 'core/network/api/wallet'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, networks }) => {
  const walletSagas = sagas({ api, networks })

  return function* coreWalletSaga() {
    yield takeLatest(AT.SET_DEFAULT_ACCOUNT, walletSagas.refetchContextData)
    yield takeLatest(AT.SET_ADDRESS_ARCHIVED, walletSagas.refetchContextData)
    yield takeLatest(AT.SET_ACCOUNT_ARCHIVED, walletSagas.refetchContextData)
    // @ts-ignore
    yield takeLatest(AT.SET_HD_ADDRESS_LABEL, walletSagas.setHDAddressLabel)
    yield takeLatest(AT.CHECK_UPDATE_ACCT_LABELS, walletSagas.checkAndUpdateWalletNames)
    yield takeLatest(AT.UPDATE_MNEMONIC_BACKUP, walletSagas.updateMnemonicBackup)
  }
}

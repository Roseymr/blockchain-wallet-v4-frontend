import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { connect, ConnectedProps } from 'react-redux'

import { Text } from 'blockchain-info-components'
import { fiatToString } from 'blockchain-wallet-v4/src/exchange/utils'
import {
  FiatSBAndSwapTransactionType,
  SupportedWalletCurrenciesType
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { convertBaseToStandard } from 'data/components/exchange/services'
import { RootState } from 'data/rootReducer'

import {
  Addresses,
  Col,
  DetailsColumn,
  DetailsRow,
  Row,
  RowHeader,
  RowValue,
  StatusAndType,
  StyledCoinDisplay,
  StyledFiatDisplay,
  TxRow,
  TxRowContainer
} from '../components'
import { Props as OwnProps } from '../TransactionList'
import { Destination, IconTx, Origin, Status, Timestamp, TransactionType } from './model'

const CustodialTxListItem: React.FC<Props> = (props) => {
  const [isToggled, setIsToggled] = useState(false)
  const { tx } = props
  const { coinfig } = window.coins[tx.amount.symbol]
  return (
    <TxRowContainer onClick={() => setIsToggled(!isToggled)}>
      <TxRow>
        <Row width='30%'>
          <IconTx {...props} />
          <StatusAndType data-e2e='orderStatusColumn'>
            <Text size='16px' color='grey800' weight={600} data-e2e='txTypeText'>
              <TransactionType {...props} /> {tx.amount.symbol}
            </Text>
            <Timestamp {...props} />
          </StatusAndType>
        </Row>
        <Col width='50%'>
          <Addresses
            from={
              <>
                <Origin {...props} />
              </>
            }
            to={
              <>
                <Destination {...props} />
              </>
            }
          />
        </Col>
        <Col width='20%' style={{ textAlign: 'right' }} data-e2e='orderAmountColumn'>
          <StyledCoinDisplay coin={props.coin} data-e2e='orderCoinAmt'>
            {!coinfig.type.isFiat && tx.type !== 'SELL'
              ? tx.amountMinor
              : !coinfig.type.isFiat && tx.type === 'SELL'
              ? convertBaseToStandard('FIAT', tx.amountMinor)
              : tx.amount.value}
          </StyledCoinDisplay>
          {props.coin !== props.currency && (
            <StyledFiatDisplay
              size='14px'
              weight={500}
              coin={props.coin}
              color='grey600'
              data-e2e='orderFiatAmt'
            >
              {!coinfig.type.isFiat && tx.type !== 'SELL'
                ? tx.amountMinor
                : !coinfig.type.isFiat && tx.type === 'SELL'
                ? convertBaseToStandard('FIAT', tx.amountMinor)
                : tx.amount.value}
            </StyledFiatDisplay>
          )}
        </Col>
      </TxRow>
      {isToggled && (
        <DetailsRow>
          <DetailsColumn>
            <RowHeader>
              <FormattedMessage
                defaultMessage='Transaction ID'
                id='modals.simplebuy.summary.txid'
              />
            </RowHeader>
            <RowValue>{tx.id}</RowValue>
            {tx.type === 'SELL' && (
              <>
                <RowHeader>
                  <FormattedMessage
                    id='modals.simplebuy.summary.rate'
                    defaultMessage='Exchange Rate'
                  />
                </RowHeader>
                <RowValue data-e2e='sellRate'>
                  {fiatToString({
                    unit: tx.amount.fiatSymbol || 'USD',
                    value: tx.extraAttributes?.indicativePrice || 0
                  })}{' '}
                  / {tx.amount.symbol}
                </RowValue>
              </>
            )}
          </DetailsColumn>
          <DetailsColumn />
          <DetailsColumn>
            <RowHeader>
              <FormattedMessage defaultMessage='Status' id='components.txlistitem.status' />
            </RowHeader>
            <RowValue>
              <Status {...props} />
            </RowValue>
            {tx.type === 'SELL' && (
              <>
                {' '}
                <RowHeader>
                  <FormattedMessage id='copy.amount' defaultMessage='Amount' />
                </RowHeader>
                <RowValue data-e2e='sbSelling'>
                  {convertBaseToStandard(tx.amount.symbol, tx.amount.inputMoney)} of{' '}
                  {tx.amount.symbol}
                </RowValue>
              </>
            )}
          </DetailsColumn>
        </DetailsRow>
      )}
    </TxRowContainer>
  )
}

const mapStateToProps = (state: RootState) => ({
  supportedCoins: selectors.core.walletOptions
    .getSupportedCoins(state)
    .getOrElse({} as SupportedWalletCurrenciesType)
})

const connector = connect(mapStateToProps)

export type Props = OwnProps &
  ConnectedProps<typeof connector> & {
    tx: FiatSBAndSwapTransactionType
  }

export default connector(CustodialTxListItem)

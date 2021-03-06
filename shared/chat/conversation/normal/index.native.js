// @flow
import * as React from 'react'
import Banner from '../bottom-banner/container'
import HeaderArea from '../header-area/container'
import InputArea from '../input-area/container'
import ListArea from '../list-area/container'
import {Box, LoadingLine, Text, HeaderHocHeader} from '../../../common-adapters'
import {globalStyles, globalColors, globalMargins} from '../../../styles'
import type {Props} from './index.types'

const Offline = () => (
  <Box
    style={{
      ...globalStyles.flexBoxCenter,
      backgroundColor: globalColors.grey,
      paddingBottom: globalMargins.tiny,
      paddingLeft: globalMargins.medium,
      paddingRight: globalMargins.medium,
      paddingTop: globalMargins.tiny,
      width: '100%',
    }}
  >
    <Text style={{textAlign: 'center'}} type="BodySmallSemibold">
      Couldn't load all chat messages due to network connectivity. Retrying...
    </Text>
  </Box>
)

class Conversation extends React.PureComponent<Props> {
  render() {
    return (
      <Box style={containerStyle}>
        {this.props.isSearching && (
          <HeaderHocHeader title="New Chat" onCancel={this.props.onCancelSearch} headerStyle={_headerStyle} />
        )}
        {this.props.threadLoadedOffline && <Offline />}
        <HeaderArea
          onToggleInfoPanel={this.props.onToggleInfoPanel}
          infoPanelOpen={false}
          conversationIDKey={this.props.conversationIDKey}
        />
        {this.props.showLoader && <LoadingLine />}
        <ListArea
          onToggleInfoPanel={this.props.onToggleInfoPanel}
          listScrollDownCounter={this.props.listScrollDownCounter}
          onFocusInput={this.props.onFocusInput}
          conversationIDKey={this.props.conversationIDKey}
        />
        <Banner conversationIDKey={this.props.conversationIDKey} />
        <InputArea
          focusInputCounter={this.props.focusInputCounter}
          onScrollDown={this.props.onScrollDown}
          conversationIDKey={this.props.conversationIDKey}
        />
      </Box>
    )
  }
}

const containerStyle = {
  ...globalStyles.flexBoxColumn,
  ...globalStyles.fullHeight,
}

const _headerStyle = {
  borderBottomWidth: 0,
}

export default Conversation

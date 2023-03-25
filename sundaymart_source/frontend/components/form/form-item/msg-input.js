import React, { Component } from "react";
import autosize from "autosize";
import Chat1FillIcon from "remixicon-react/Chat1FillIcon";
import { withTranslation } from "react-i18next";

class MessageInput extends Component {
  componentDidMount() {
    this.textarea.focus();
    autosize(this.textarea);
  }
  render() {
    const { t } = this.props;
    return (
      <div className="sms-input">
        <Chat1FillIcon className="chat1" />
        <textarea
          required={this.props.required}
          ref={(c) => (this.textarea = c)}
          placeholder={t("Type comment here")}
          rows={1}
          onChange={(e) => this.props.onChange(e)}
          name={this.props.name}
          value={this.props.value}
        />
      </div>
    );
  }
}
export default withTranslation()(MessageInput);

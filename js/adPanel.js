/********************************************************************
  AD PANEL
*********************************************************************/
/**
* The screen used while the video is playing.
*
* @class AdPanel
* @constructor
*/

var AdPanelTopBarItem = React.createClass({
  render: function() {
    return <div className={this.props.itemClassName} style={this.props.style} onClick={this.props.onLearnMoreButtonClicked} onTouchEnd={this.props.onLearnMoreButtonClicked}>
          {this.props.data}
        </div>;
  }
});

var AdPanel = React.createClass({
  componentDidMount: function(){
    if (Utils.isSafari()){
      adScreenStyle.topBarStyle.display = "-webkit-flex";
    }
    else {
      adScreenStyle.topBarStyle.display = "flex";
    }
  },

  handleLearnMoreButtonClick: function(event) {
    if (event.type == 'touchend' || !this.isMobile){
      //since mobile would fire both click and touched events,
      //we need to make sure only one actually does the work

      console.log("Learn more button clicked");
      event.stopPropagation(); // W3C
      event.cancelBubble = true; // IE
      this.props.controller.onAdsClicked();
    }
  },

  isValidAdPlaybackInfo: function(playbackInfo) {
    return (playbackInfo !== null &&
            typeof playbackInfo !== 'undefined' &&
            playbackInfo !== "");
  },

  populateAdTopBar: function() {
    var adTopBarItems = [];

    // // Ad title
    var adTitle = this.props.currentAdsInfo.currentAdItem.name;
    // AMC puts "Unknown" in the name field if ad name unavailable
    if (this.isValidAdPlaybackInfo(adTitle) && this.props.controlBarWidth > 560) {
      var adTitleDiv = <AdPanelTopBarItem key="AdTitle" style={adScreenStyle.adPanelTopBarTextStyle} data={adTitle} itemClassName="adTitle"/>;
      adTopBarItems.push(adTitleDiv);
    }

    // Ad playback Info
    var adPlaybackInfo = Utils.getLocalizedString(this.props.language, SKIN_TEXT.AD, this.props.localizableStrings);
    var currentAdIndex = this.props.currentAdsInfo.currentAdItem.indexInPod;
    var totalNumberOfAds = this.props.currentAdsInfo.numberOfAds;
    if (this.isValidAdPlaybackInfo(currentAdIndex) && this.isValidAdPlaybackInfo(totalNumberOfAds)) {
      adPlaybackInfo = adPlaybackInfo + ": (" + currentAdIndex + "/" + totalNumberOfAds + ")";
    }

    var remainingTime = Utils.formatSeconds(parseInt(this.props.currentAdsInfo.currentAdItem.duration - this.props.currentPlayhead));
    adPlaybackInfo = adPlaybackInfo + " - " + remainingTime;

    var adPlaybackInfoDiv = <AdPanelTopBarItem key="adPlaybackInfo" style={adScreenStyle.adPanelTopBarTextStyle} data={adPlaybackInfo} itemClassName="adPlaybackInfo"/>;
    adTopBarItems.push(adPlaybackInfoDiv);

    // Flexible space
    var flexibleSpaceDiv = <AdPanelTopBarItem key="flexibleSpace" style={adScreenStyle.flexibleSpace} itemClassName="flexibleSpace"/>;
    adTopBarItems.push(flexibleSpaceDiv);

    // Learn more
    if (this.props.currentAdsInfo.currentAdItem !== null && this.isValidAdPlaybackInfo(this.props.currentAdsInfo.currentAdItem.clickUrl)) {
      var learnMoreText = Utils.getLocalizedString(this.props.language, SKIN_TEXT.LEARN_MORE, this.props.localizableStrings);
      var learnMoreButtonDiv = <AdPanelTopBarItem key="learnMoreButton" onLearnMoreButtonClicked={this.handleLearnMoreButtonClick} style={adScreenStyle.learnMoreButtonStyle} data={learnMoreText} itemClassName="learnMore"/>;
      adTopBarItems.push(learnMoreButtonDiv);
    }

    // Skip
    if (this.props.currentAdsInfo.currentAdItem.skippable) {
      var skipButtonText = Utils.getLocalizedString(this.props.language, SKIN_TEXT.SKIP_AD, this.props.localizableStrings);
      var skipButtonDiv = <AdPanelTopBarItem key="skipButton" style={adScreenStyle.skipButtonStyle} data={skipButtonText} itemClassName="skip"/>;
      adTopBarItems.push(skipButtonDiv);
    }
    return adTopBarItems;
  },


  render: function() {
    var adTopBarItems = this.populateAdTopBar();
    return (
      <div style={adScreenStyle.panelStyle}>
        <div className="adTopBar" style={adScreenStyle.topBarStyle}>
          {adTopBarItems}
        </div>
      </div>
    );
  }
});
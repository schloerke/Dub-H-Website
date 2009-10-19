//
//  iWeb - Slideshow.js
//  Copyright (c) 2007-2008 Apple Inc. All rights reserved.
//

var DidStartLoadingImagesNotification="DidStartLoadingImages";var SlideshowGlue=Class.create(Widget,{widgetIdentifier:"com-apple-iweb-widget-slideshow",initialize:function($super,instanceID,widgetPath,sharedPath,sitePath,preferences,runningInApp)
{if(instanceID)
{$super(instanceID,widgetPath,sharedPath,sitePath,preferences,runningInApp);this.mInstanceID=instanceID;this.updateFromPreferences();}},onload:function()
{},onunload:function()
{},loadFromStream:function(mediaStream)
{if(this.p_enabled())
{if(this.runningInApp)
{var slideshowDiv=this.getElementById("slideshow_placeholder");slideshowDiv.onmouseover=function()
{mediaStream.load(this.p_baseURL(),this.onStreamLoad.bind(this));}.bind(this);}
else
{mediaStream.load(this.p_baseURL(),this.onStreamLoad.bind(this));}}
else
{}},onStreamLoad:function(imageStream)
{var slideshowDiv=this.getElementById("slideshow_placeholder");if(this.mSlideshow!=null)
{this.mSlideshow.pause();slideshowDiv.innerHTML="";}
var skipStride=0;var nextToSkip=999999999;var transitionIndex=this.p_transitionIndex();var scrub=(transitionIndex==255);if(scrub)
{var numberToSkip=imageStream.length-50;if(numberToSkip>0)
{skipStride=imageStream.length/numberToSkip;nextToSkip=0;}}
var photos=[];var imageType=this.p_imageType();for(var i=0;i<imageStream.length;++i)
{if(i>nextToSkip)
{nextToSkip+=skipStride;}
else
{photos.push(imageStream[i].slideshowValue(imageType));}}
var options={backgroundColor:this.p_backgroundColor(),scaleMode:this.p_scaleMode(),movieMode:this.p_movieMode(),shouldTighten:false};this.mSlideshow=new Slideshow(slideshowDiv,photos,function(){},options);if(scrub)
{this.mSlideshow.setTransitionIndex(1,0);}
else
{this.mSlideshow.setTransitionIndex(transitionIndex,0);}
this.mSlideshow.pause();this.mSlideshow.photoDuration=this.p_photoDuration();var startIndex=this.p_startIndex();if(startIndex>=imageStream.length)
{startIndex=0;}
this.mSlideshow.showPhotoNumber(startIndex);if(this.runningInApp)
{window.onresize=function()
{this.p_onResize();}.bind(this)}
if(scrub)
{var heightPct="100%";for(var i=0;i<photos.length;++i)
{var div=$(document.createElement("div"));div.className="scrubBand";div.setStyle({position:"absolute",top:0,height:heightPct,zIndex:100,backgroundImage:"url("+transparentGifURL()+")"});div.onmouseover=this.p_scrub.bind(this,slideshowDiv,i);slideshowDiv.appendChild(div);}
this.p_positionScrubBands();}
slideshowDiv.onmouseover=null;if(this.p_showOnMouseOver())
{IWSetDivOpacity(slideshowDiv,0.0);if(scrub)
{var self=this;slideshowDiv.onmouseover=function()
{self.mLoadingImages=true;self.p_startLoadingImages();slideshowDiv.onmouseout=function()
{self.mLoadingImages=false;IWSetDivOpacity(slideshowDiv,0.0);}}}
else
{var self=this;slideshowDiv.onmouseover=function()
{self.p_startSlideshow(slideshowDiv);slideshowDiv.onmouseout=function()
{self.p_pauseSlideshow(slideshowDiv);}}}}
else
{if(scrub)
{slideshowDiv.onmouseout=function()
{this.mSlideshow.showPhotoNumber(0);}.bind(this);}
else
{this.p_startSlideshow(slideshowDiv);}}},p_didStartLoadingImages:function(notification)
{if(notification.object()!==this)
{this.p_unloadImages();}},p_startLoadingImages:function()
{if(this.runningInApp)
{this.preferences.postCrossWidgetNotification(DidStartLoadingImagesNotification,{});}
else
{NotificationCenter.postNotification(new IWNotification(DidStartLoadingImagesNotification,this,{}));}
if(!this.mListeningForNotifications)
{this.mListeningForNotifications=true;NotificationCenter.addObserver(null,this.p_didStartLoadingImages.bind(this),DidStartLoadingImagesNotification,null);}
if(this.mCurrentLoadingImageIndex===undefined)
{this.mCurrentLoadingImageIndex=0;}
var loadImage=function()
{if(this.mLoadingImages)
{var index=this.mCurrentLoadingImageIndex;var photos=this.mSlideshow.photos;if(index<photos.length)
{var image=photos[index].image;image.load(function(image)
{if(this.mCurrentLoadingImageIndex<photos.length&&image===photos[this.mCurrentLoadingImageIndex].image)
{image.preventUnloading();++this.mCurrentLoadingImageIndex;loadImage();}}.bind(this,image),true);}}}.bind(this);loadImage();},p_unloadImages:function()
{var photos=this.mSlideshow.photos;for(var index=0;index<this.mCurrentLoadingImageIndex;++index)
{var image=photos[index].image;image.allowUnloading();image.unload(true);}
this.mCurrentLoadingImageIndex=0;},p_scrub:function(slideshowDiv,index)
{this.mSlideshow.showPhotoNumber(index);IWSetDivOpacity(slideshowDiv,1.0);this.mLoadingImages=true;},p_positionScrubBands:function()
{var slideshowDiv=this.getElementById("slideshow_placeholder");var left=0;var totalWidth=slideshowDiv.offsetWidth;var bands=slideshowDiv.select(".scrubBand");for(var i=0;i<bands.length;++i)
{var right=Math.round((i+1)*totalWidth/bands.length);var div=bands[i];$(div).setStyle({left:px(left),width:px(right-left)});left=right;}},p_onResize:function()
{if(this.mSlideshow)
{var slideshowDiv=this.getElementById("slideshow_placeholder");if(slideshowDiv.offsetWidth!=this.mSlideshowOffsetWidth)
{this.mSlideshowOffsetWidth=slideshowDiv.offsetWidth;this.mSlideshow.updateSize();this.p_positionScrubBands();}}},changedPreferenceForKey:function(key)
{if(key=="mediaStream")
{var mediaStream=this.p_mediaStream();if(mediaStream!==null)
{this.loadFromStream(mediaStream);}}},updateFromPreferences:function()
{var mediaStream=this.p_mediaStream();this.loadFromStream(mediaStream);},p_mediaStream:function()
{var mediaStream=null;if(this.preferences)
{mediaStream=this.preferenceForKey("mediaStreamObject");if(mediaStream==null||mediaStream==undefined)
{var mediaStreamCode=this.preferenceForKey("mediaStream");if(mediaStreamCode!=null&&mediaStreamCode.length>0)
{mediaStream=eval(mediaStreamCode);}}}
return mediaStream;},p_backgroundColor:function()
{var backgroundColor=null;if(this.preferences)
{backgroundColor=this.preferenceForKey("color");}
if(backgroundColor===undefined)
{backgroundColor="black";}
return backgroundColor;},p_baseURL:function()
{return this.preferenceForKey("baseURL");},p_enabled:function()
{var enabled=null;if(this.preferences)
{enabled=this.preferenceForKey("slideshowEnabled");}
if(enabled===undefined)
{enabled=false;}
return enabled;},p_fadeIn:function()
{var fadeIn=null;if(this.preferences)
{fadeIn=this.preferenceForKey("fadeIn");}
if(fadeIn===undefined)
{fadeIn=false;}
return fadeIn;},p_showOnMouseOver:function()
{var showOnMouseOver=null;if(this.preferences)
{showOnMouseOver=this.preferenceForKey("showOnMouseOver");}
if(showOnMouseOver===null||showOnMouseOver==undefined)
{showOnMouseOver=false;}
return showOnMouseOver;},p_photoDuration:function()
{var photoDuration=null;if(this.preferences)
{photoDuration=this.preferenceForKey("photoDuration")*1000;}
if(photoDuration===null)
{photoDuration=5000;}
return photoDuration;},p_startIndex:function()
{var startIndex=null;if(this.preferences)
{startIndex=this.preferenceForKey("startIndex");}
if(startIndex===undefined)
{startIndex=0;}
return startIndex;},p_scaleMode:function()
{var scaleMode=null;if(this.preferences)
{scaleMode=this.preferenceForKey("scaleMode");}
if(scaleMode===undefined)
{scaleMode="fit";}
return scaleMode;},p_transitionIndex:function()
{var transitionIndex=null;if(this.preferences)
{transitionIndex=this.preferenceForKey("transitionIndex");}
if(transitionIndex===undefined)
{transitionIndex=0;}
return transitionIndex;},p_imageType:function()
{var imageType=null;if(this.preferences)
{imageType=this.preferenceForKey("imageType");}
if(imageType===null||imageType==undefined)
{imageType="image";}
return imageType;},p_movieMode:function()
{var movieMode=null;if(this.preferences)
{movieMode=this.preferenceForKey("movieMode");}
if(movieMode===null||movieMode==undefined)
{movieMode=kShowMovie;}
return movieMode;},p_startSlideshow:function(slideshowDiv)
{if(this.mSlideshow&&this.p_enabled())
{if(this.p_fadeIn())
{var self=this;var startOpacity=slideshowDiv.getStyle("opacity");if(this.mFadeAnimation)
{this.mFadeAnimation.stop();}
this.mFadeAnimation=new SimpleAnimation(function()
{delete self.mFadeAnimation;self.mSlideshow.resume();});this.mFadeAnimation.pre=function()
{IWSetDivOpacity(slideshowDiv,startOpacity);}
this.mFadeAnimation.post=function()
{IWSetDivOpacity(slideshowDiv,1.0);}
this.mFadeAnimation.update=function(now)
{IWSetDivOpacity(slideshowDiv,startOpacity+now*(1.0-startOpacity));}
this.mFadeAnimation.start();}
else
{this.mSlideshow.resume();}}},p_pauseSlideshow:function(slideshowDiv)
{if(this.mSlideshow)
{this.mSlideshow.pause();if(this.p_fadeIn())
{var startOpacity=slideshowDiv.getStyle("opacity");if(this.mFadeAnimation)
{this.mFadeAnimation.stop();}
var self=this;this.mFadeAnimation=new SimpleAnimation(function()
{delete self.mFadeAnimation;var startIndex=self.p_startIndex();if(self.mSlideshow.currentPhotoNumber==startIndex-1&&startIndex<self.mSlideshow.photos.length)
{self.mSlideshow.showPhotoNumber(startIndex,true);}});this.mFadeAnimation.pre=function()
{IWSetDivOpacity(slideshowDiv,startOpacity);}
this.mFadeAnimation.post=function()
{IWSetDivOpacity(slideshowDiv,0);}
this.mFadeAnimation.update=function(now)
{IWSetDivOpacity(slideshowDiv,startOpacity*(1.0-now));}
this.mFadeAnimation.start();}}}});
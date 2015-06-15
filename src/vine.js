(function() {
  'use strict';

  var vid_url, view_count;

  if (!!document.querySelector('script[type="application/ld+json"]')) { // non-embed
    var conf = JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent);
    vid_url = conf.sharedContent.contentUrl;
    view_count = parseInt(conf.sharedContent.interactionCount);
  } else if (document.getElementById("configuration")) { // embed
    var conf = JSON.parse(document.getElementById("configuration").textContent);
    console.log(conf);
    vid_url = conf.post.videoUrls[0].videoUrl;
    view_count = conf.post.loops.count;
  } else {
    console.log("Can't find a config to read :(");
  }

  if (vid_url) {
    mangle(vid_url,view_count,function(blob_url) {

      var root_of_interest = document.querySelector(".video-container.main");

      function maxHeadroom(target) {
        if (target.src != blob_url) {
        // if ((target.src.indexOf("blob:")===0) && (target.src != blob_url)) {
          target.src = blob_url;
          target.loop = true;
          target.play();
        }
      }

      function watchVideo(target) {
        maxHeadroom(target);
        video_observer.observe(target,{attributes: true, attributeFilter:['src']})
      }

      var video_observer = new MutationObserver(function(muts) {
        muts.forEach(function(mut) {
          maxHeadroom(mut.target);
        });
      });

      [].forEach.call(root_of_interest.querySelectorAll("video"), watchVideo);

      var body_observer = new MutationObserver(function(muts) {
        muts.forEach(function(mut) {
          [].forEach.call(mut.addedNodes,function(node) {
            if (node.nodeName === 'VIDEO') {
              watchVideo(node);
            }
          });
        });
      });

      body_observer.observe(root_of_interest, {childList: true, subtree: true});
    });
  }
})();
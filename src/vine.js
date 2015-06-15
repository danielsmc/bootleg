(function() {
  'use strict';

  // From http://stackoverflow.com/questions/521295/javascript-random-seeds/29450606#29450606
  // TODO: Make sure it actually works?
  function seededRandom(s) {
    var m_w  = s;
    var m_z  = 987654321;
    var mask = 0xffffffff;

    return function() {
      m_z = (36969 * (m_z & 65535) + (m_z >> 16)) & mask;
      m_w = (18000 * (m_w & 65535) + (m_w >> 16)) & mask;

      var result = ((m_z << 16) + m_w) & mask;
      result /= 4294967296;

      return result + 0.5;
    }
}

  // Using buf.length as the random seed, calculate a uniformly random value 0<=n<1
  // for each byte. Given the probablity of destruction each time a byte is read p(d)
  // and the view count c, we'll destroy evey byte where n<(1-(1-p(d))^c)

  var p_d = 1e-8;

  function perturb(buf,view_count) {
    var threshold = 1-Math.pow(1-p_d,view_count);
    var bl = buf.length;
    var myRand = seededRandom(bl);
    var destroyed = 0;
    for(var i = 0; i < bl; i++) {
      if (myRand()<threshold) {
        buf[i] = 0;
        destroyed++;
      }
    }
    console.log(view_count);
    console.log("destroyed", destroyed, "out of", bl);
  }

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
    var vid_req = new XMLHttpRequest();
    vid_req.open("GET", vid_url, true);
    vid_req.responseType = 'arraybuffer';

    vid_req.onload = function (oEvent) {
      var vid_array = new Uint8Array(vid_req.response);
      perturb(vid_array,view_count);
      var vid_blob = new Blob([vid_array], { type: 'video/mp4' });
      var blob_url = window.URL.createObjectURL(vid_blob);
      console.log(blob_url);

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
    };
    vid_req.send(null);
  }

})();
const YoutubeService = (() => {

  // Busca en YouTube "vlog dolores hidalgo guanajuato"
  // Copia el ID del video (lo que va después de ?v= en la URL)
  const VIDEO_ID = 'J6GA7tQmrAY';

  return {
    init() {
      console.log('[YoutubeService] esperando SDK...');
    },

    createPlayer() {
      const container = document.getElementById('youtube-container');
      if (!container) return;
      container.innerHTML = '';

      new YT.Player('youtube-container', {
        videoId: VIDEO_ID,
        playerVars: { autoplay: 0, rel: 0, modestbranding: 1 },
        events: {
          onReady: () => console.log('[YoutubeService] listo'),
          onError: (e) => console.error('[YoutubeService] error:', e.data)
        }
      });
    }
  };
})();
const dropArea = document.getElementById('drop-area');
const fileInput = document.getElementById('fileElem');
const fileSelectBtn = document.getElementById('fileSelectBtn');
const gallery = document.getElementById('gallery');

// Open file dialog on button click
fileSelectBtn.addEventListener('click', () => fileInput.click());

// Highlight drop area when files are dragged over
dropArea.addEventListener('dragenter', preventDefaults, false);
dropArea.addEventListener('dragover', (e) => {
  preventDefaults(e);
  dropArea.classList.add('dragover');
});
dropArea.addEventListener('dragleave', (e) => {
  preventDefaults(e);
  dropArea.classList.remove('dragover');
});
dropArea.addEventListener('drop', (e) => {
  preventDefaults(e);
  dropArea.classList.remove('dragover');
  handleFiles(e.dataTransfer.files);
});

// Handle file input change
fileInput.addEventListener('change', () => {
  handleFiles(fileInput.files);
  fileInput.value = ''; // Reset input so same file can be uploaded again if needed
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleFiles(files) {
  [...files].forEach(file => {
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      alert(`Unsupported file type: ${file.name}`); // Fixed template literal
      return;
    }
    previewFile(file);
  });
}

function previewFile(file) {
  const mediaItem = document.createElement('article');
  mediaItem.className = 'media-item';
  mediaItem.setAttribute('tabindex', '0');
  mediaItem.setAttribute(
    'aria-label',
    `${file.type.startsWith('image/') ? 'Image' : 'Video'} preview: ${file.name}`
  );

  // Create media element
  let media;
  if (file.type.startsWith('image/')) {
    media = document.createElement('img');
    media.alt = file.name;
  } else {
    media = document.createElement('video');
    media.controls = true;
    media.muted = true;
    media.playsInline = true;
  }

  // Create progress bar container
  const progressContainer = document.createElement('div');
  progressContainer.className = 'progress-container';

  // Create progress bar
  const progressBar = document.createElement('div');
  progressBar.className = 'progress-bar';
  progressContainer.appendChild(progressBar);

  // Create delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.setAttribute('aria-label', `Delete ${file.name}`); // Fixed template literal
  deleteBtn.innerHTML = '&times;';

  deleteBtn.addEventListener('click', () => {
    // Revoke object URL to free memory
    if (media.src) URL.revokeObjectURL(media.src);
    // Animate removal
    mediaItem.style.transform = 'scale(0)';
    mediaItem.style.opacity = '0';
    setTimeout(() => mediaItem.remove(), 300);
  });

  mediaItem.appendChild(media);
  mediaItem.appendChild(progressContainer);
  mediaItem.appendChild(deleteBtn);
  gallery.appendChild(mediaItem);

  // Load file and simulate upload progress
  const url = URL.createObjectURL(file);
  media.src = url;

  // Simulate upload progress animation (since no backend)
  simulateProgress(progressBar);
}

function simulateProgress(progressBar) {
  let width = 0;
  const interval = setInterval(() => {
    width += Math.random() * 15;
    if (width >= 100) {
      width = 100;
      clearInterval(interval);
      // Hide progress bar after short delay
      setTimeout(() => {
        progressBar.parentElement.style.opacity = '0';
        setTimeout(() => {
          progressBar.parentElement.style.display = 'none';
        }, 300);
      }, 500);
    }
    progressBar.style.width = width + '%';
  }, 200);
}

// Modal elements
const modal = document.getElementById('modal');
const modalContent = modal.querySelector('.modal-content');
const modalCloseBtn = document.getElementById('modalCloseBtn');

// Open modal with clicked media
gallery.addEventListener('click', (e) => {
  const target = e.target;
  if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
    openModal(target);
  }
});

function openModal(media) {
  // Clear previous content
  modalContent.innerHTML = '';

  let clone;
  if (media.tagName === 'IMG') {
    clone = document.createElement('img');
    clone.src = media.src;
    clone.alt = media.alt || 'Image preview';
  } else if (media.tagName === 'VIDEO') {
    clone = document.createElement('video');
    clone.src = media.src;
    clone.controls = true;
    clone.autoplay = true;
    clone.muted = false;
    clone.playsInline = true;
  }

  modalContent.appendChild(clone);
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');

  // Make modalContent focusable and focus it for accessibility
  modalContent.setAttribute('tabindex', '-1');
  modalContent.focus();
}

// Close modal function
function closeModal() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  modalContent.innerHTML = '';
  modalContent.removeAttribute('tabindex');
}

// Close modal on close button click
modalCloseBtn.addEventListener('click', closeModal);

// Close modal on click outside content
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('show')) {
    closeModal();
  }
});

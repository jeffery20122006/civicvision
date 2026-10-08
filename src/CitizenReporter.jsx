import { useState, useRef } from 'react';
import { Camera, MapPin, CheckCircle, AlertCircle, UploadCloud, Loader2 } from 'lucide-react';
import './CitizenReporter.css';

const CitizenReporter = () => {
  const [image, setImage] = useState(null);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleFetchLocation = () => {
    setLoadingLocation(true);
    setStatusMessage('');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setLoadingLocation(false);
        },
        (error) => {
          console.error(error);
          setStatusMessage('Failed to fetch location. Please check your permissions.');
          setLoadingLocation(false);
        }
      );
    } else {
      setStatusMessage('Geolocation is not supported by your browser.');
      setLoadingLocation(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setStatusMessage('Please provide an image.');
      return;
    }
    if (!location.lat || !location.lng) {
      setStatusMessage('Please fetch your location.');
      return;
    }

    setSubmitting(true);
    setStatusMessage('');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('latitude', location.lat);
    formData.append('longitude', location.lng);

    try {
      const response = await fetch('http://localhost:5000/api/report', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatusMessage('Issue reported successfully! Thank you for your contribution.');
        setImage(null);
        setLocation({ lat: null, lng: null });
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setStatusMessage('Failed to submit report. Please try again later.');
      }
    } catch (error) {
      console.error(error);
      setStatusMessage('An error occurred during submission.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reporter-container">
      <div className="reporter-card glass-panel">
        <div className="card-header">
          <h2>Report a Civic Issue</h2>
          <p>Help us improve the community by reporting issues directly.</p>
        </div>

        <form onSubmit={handleSubmit} className="reporter-form">
          <div className="form-group">
            <label>1. Capture or Upload Image</label>
            <div 
              className={`image-upload-area ${image ? 'has-image' : ''}`}
              onClick={() => fileInputRef.current.click()}
            >
              {image ? (
                <img src={URL.createObjectURL(image)} alt="Preview" className="image-preview" />
              ) : (
                <div className="upload-placeholder">
                  <UploadCloud size={32} style={{ color: 'var(--accent-color)', marginBottom: '8px' }} />
                  <span>Tap to snap or upload issue image</span>
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
          </div>

          <div className="form-group">
            <label>2. Your Current Location</label>
            <div className="location-section">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleFetchLocation}
                disabled={loadingLocation}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                {loadingLocation ? (
                  <>
                    <Loader2 size={16} className="spin" /> Fetching GPS...
                  </>
                ) : (
                  <>
                    <MapPin size={16} /> Get GPS Location
                  </>
                )}
              </button>
              {location.lat && location.lng && (
                <div className="location-details">
                  <span className="badge">Lat: {location.lat.toFixed(5)}</span>
                  <span className="badge">Lng: {location.lng.toFixed(5)}</span>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={submitting || !image || !location.lat}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="spin" /> Submitting...
              </>
            ) : (
              <>
                <Camera size={18} /> Submit Report
              </>
            )}
          </button>
        </form>

        {statusMessage && (
          <div className={`status-message ${statusMessage.includes('successfully') ? 'success' : 'error'}`} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {statusMessage.includes('successfully') ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenReporter;


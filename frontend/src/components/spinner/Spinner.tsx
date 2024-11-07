import React from 'react';

const Spinner: React.FC = () => {
  return (
    <div className="flex justify-center min-h-screen">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid"
        width="160"
        height="160"
        style={{ shapeRendering: 'auto', display: 'block', background: 'transparent' }}
        xmlnsXlink="http://www.w3.org/1999/xlink">
        <g>
          <g transform="translate(50,50)">
            <g transform="scale(0.8)">
              <g transform="translate(-50,-50)">
                <g>
                  <animateTransform calcMode="spline" keySplines="0.5 0.5 0.5 0.5" dur="2s" keyTimes="0;1" values="360 50 50;0 50 50" repeatCount="indefinite" type="rotate" attributeName="transform" />
                  <path d="M54.3,28.1h34.2c-4.5-9.3-12.4-16.7-21.9-20.8L45.7,28.1L54.3,28.1L54.3,28.1z" fill="#1e40af" />
                  <path d="M61.7,7.3C51.9,4,41.1,4.2,31.5,8.1v29.5l6.1-6.1L61.7,7.3C61.7,7.3,61.7,7.3,61.7,7.3z" fill="#3453b7" />
                  <path d="M28.1,11.6c-9.3,4.5-16.7,12.4-20.8,21.9l20.8,20.8v-8.6L28.1,11.6C28.1,11.6,28.1,11.6,28.1,11.6z" fill="#4a66bf" />
                  <path d="M31.5,62.4L7.3,38.3c0,0,0,0,0,0C4,48.1,4.2,58.9,8.1,68.5h29.5L31.5,62.4z" fill="#6179c7" />
                  <path d="M45.7,71.9H11.5c0,0,0,0,0,0c4.5,9.3,12.4,16.7,21.9,20.8l20.8-20.8H45.7z" fill="#1e40af" />
                  <path d="M62.4,68.5L38.3,92.6c0,0,0,0,0,0c9.8,3.4,20.6,3.1,30.2-0.8V62.4L62.4,68.5z" fill="#3453b7" />
                  <path d="M71.9,45.7v8.6v34.2c0,0,0,0,0,0c9.3-4.5,16.7-12.4,20.8-21.9L71.9,45.7z" fill="#4a66bf" />
                  <path d="M91.9,31.5C91.9,31.5,91.9,31.5,91.9,31.5l-29.5,0l0,0l6.1,6.1l24.1,24.1c0,0,0,0,0,0 C96,51.9,95.8,41.1,91.9,31.5z" fill="#6179c7" />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}

export default Spinner;
import React from 'react';
import Svg, { Path } from 'react-native-svg';

// // Mic Icon
// export const MicIcon = ({ size = 24, color = 'black' }: { size?: number; color?: string }) => (
//     <Svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 32 32" height="200px" width="200px"><Path d="M 13 4 C 11.90625 4 11 4.90625 11 6 L 11 18 C 11 19.09375 11.90625 20 13 20 L 19 20 C 20.09375 20 21 19.09375 21 18 L 21 6 C 21 4.90625 20.09375 4 19 4 Z M 13 6 L 19 6 L 19 18 L 13 18 Z M 7 14 L 7 18 C 7 21.300781 9.699219 24 13 24 L 15 24 L 15 26 L 11 26 L 11 28 L 21 28 L 21 26 L 17 26 L 17 24 L 19 24 C 22.300781 24 25 21.300781 25 18 L 25 14 L 23 14 L 23 18 C 23 20.21875 21.21875 22 19 22 L 13 22 C 10.78125 22 9 20.21875 9 18 L 9 14 Z"></Path></Svg> */}
// );

// // Stop Icon
// export const StopIcon = ({ size = 24, color = 'black' }: { size?: number; color?: string }) => (
//   <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height={size} width={size} fill={color}>
//     <Path d="M 6 6 L 26 6 L 26 26 L 6 26 Z" />
//   </Svg>
// );

// // Play Button Icon
// export const PlayIcon = ({ size = 24, color = 'black' }: { size?: number; color?: string }) => (
//   <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height={size} width={size} fill={color}>
//     <Path d="M 8 4 L 8 28 L 24 16 Z" />
//   </Svg>
// );

// // Discard/Delete Icon
// export const DeleteIcon = ({ size = 24, color = 'black' }: { size?: number; color?: string }) => (
//   <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height={size} width={size} fill={color}>
//     <Path d="M 6 2 L 10 2 L 10 0 L 22 0 L 22 2 L 26 2 L 26 4 L 24 4 L 24 28 L 8 28 L 8 4 L 6 4 Z" />
//   </Svg>
// );

// // Save Button Icon
// export const SaveIcon = ({ size = 24, color = 'black' }: { size?: number; color?: string }) => (
//   <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height={size} width={size} fill={color}>
//     <Path d="M 8 2 L 8 20 L 14 20 L 14 26 L 18 26 L 18 20 L 24 20 L 24 2 Z M 10 4 L 10 18 L 14 18 L 14 4 Z" />
//   </Svg>
// );

// // Mic Icon
// const MicIcon = ({ size = 24, color = 'black' }: { size?: number; color?: string }) => (
//   <Svg viewBox="0 0 32 32" height={size} width={size} fill={color}>
//     <Path d="M 13 4 C 11.90625 4 11 4.90625 11 6 L 11 18 C 11 19.09375 11.90625 20 13 20 L 19 20 C 20.09375 20 21 19.09375 21 18 L 21 6 C 21 4.90625 20.09375 4 19 4 Z M 13 6 L 19 6 L 19 18 L 13 18 Z M 7 14 L 7 18 C 7 21.300781 9.699219 24 13 24 L 15 24 L 15 26 L 11 26 L 11 28 L 21 28 L 21 26 L 17 26 L 17 24 L 19 24 C 22.300781 24 25 21.300781 25 18 L 25 14 L 23 14 L 23 18 C 23 20.21875 21.21875 22 19 22 L 13 22 C 10.78125 22 9 20.21875 9 18 L 9 14 Z" />
//   </Svg>
// );

// // Stop Icon
// const StopIcon = ({ size = 24, color = 'black' }: { size?: number; color?: string }) => (
//   <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height={size} width={size} fill={color}>
//     <Path d="M 6 6 L 26 6 L 26 26 L 6 26 Z" />
//   </Svg>
// );

// // Play Button Icon
// const PlayIcon = ({ size = 24, color = 'black' }: { size?: number; color?: string }) => (
//   <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height={size} width={size} fill={color}>
//     <Path d="M 8 4 L 8 28 L 24 16 Z" />
//   </Svg>
// );

// // Discard/Delete Icon
// const DeleteIcon = ({ size = 24, color = 'black' }: { size?: number; color?: string }) => (
//   <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height={size} width={size} fill={color}>
//     <Path d="M 6 2 L 10 2 L 10 0 L 22 0 L 22 2 L 26 2 L 26 4 L 24 4 L 24 28 L 8 28 L 8 4 L 6 4 Z" />
//   </Svg>
// );

// // Save Button Icon
// const SaveIcon = ({ size = 24, color = 'black' }: { size?: number; color?: string }) => (
//   <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" height={size} width={size} fill={color}>
//     <Path d="M 8 2 L 8 20 L 14 20 L 14 26 L 18 26 L 18 20 L 24 20 L 24 2 Z M 10 4 L 10 18 L 14 18 L 14 4 Z" />
//   </Svg>
// );

// // Exporting a list of icons
// export const icons = {
//   MicIcon,
//   StopIcon,
//   PlayIcon,
//   DeleteIcon,
//   SaveIcon,
// };



const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="section-container text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} Tejas S. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Built with React, TypeScript, and Tailwind CSS
        </p>
      </div>
    </footer>
  )
}

export default Footer

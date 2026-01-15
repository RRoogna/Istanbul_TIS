function Footer() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200 mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 text-center text-stone-600 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Constructor.io. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;

'use client'
import { useState, useEffect, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';

// Animation variants for the filter panel
const filterPanelVariants = {
  hidden: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut'
    }
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

// Animation variants for spec items
const specItemVariants = {
  hidden: {
    opacity: 0,
    x: 20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3
    }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: {
      duration: 0.2
    }
  }
};

// Animation variants for spec values
const specValueVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2
    }
  },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.05
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

// Animation variants for individual values
const valueItemVariants = {
  hidden: {
    opacity: 0,
    x: -10
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.2
    }
  },
  exit: {
    opacity: 0,
    x: 10,
    transition: {
      duration: 0.2
    }
  }
};

const SpecificationsFilter = ({ 
  showSpecsFilter, 
  setShowSpecsFilter, 
  specifications, 
  selectedSpecs, 
  handleSpecChange, 
  handleClearSpecs,
  selectedCount
}) => {
  const [expandedSpec, setExpandedSpec] = useState(null);

  return (
    <AnimatePresence>
      {showSpecsFilter && (
        <motion.div
          variants={filterPanelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed top-0 right-0 bottom-0 z-50 md:w-[390px] w-full h-screen bg-black border-l border-gray-600 shadow-xl flex flex-col"
        >
          {/* Header */}
          <motion.div 
            variants={specItemVariants}
            className="flex items-center justify-between p-4 border-b border-gray-600"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <h2 className="text-xl font-semibold">Filter</h2>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSpecsFilter(false)}
              className="p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </motion.div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto ">
            <div className=" space-y-4">
              <AnimatePresence>
                {specifications.map(spec => (
                  <motion.div
                    key={spec._id}
                    variants={specItemVariants}
                    className="border-b  border-white/30 last:border-0"
                  >
                    <motion.button
                      onClick={() => setExpandedSpec(expandedSpec === spec._id ? null : spec._id)}
                      className="w-full py-5 px-3 flex items-center justify-between text-left"
                      whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-sm font-medium">{spec.name}</span>
                        {selectedSpecs[spec._id]?.length > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full"
                          >
                            {selectedSpecs[spec._id]?.length}
                          </motion.span>
                        )}
                      </span>
                      <motion.div
                        animate={{ rotate: expandedSpec === spec._id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-4 h-4 text-white" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {expandedSpec === spec._id && (
                        <motion.div
                          variants={specValueVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="px-2 pb-2 space-y-1 overflow-hidden"
                        >
                          {spec.specifications?.map(value => {
                            const isSelected = selectedSpecs[spec._id]?.includes(value._id) || false;
                            return (
                              <motion.button
                                key={value._id}
                                variants={valueItemVariants}
                                onClick={() => handleSpecChange(spec._id, value._id)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors rounded-sm ${
                                  isSelected 
                                    ? 'bg-blue-600 text-white' 
                                    : 'text-gray-300 bg-white/20 hover:bg-white/5'
                                }`}
                                whileHover={{ x: 5 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                {value.spec}
                              </motion.button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <AnimatePresence>
            {selectedCount > 0 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="border-t border-white/10 bg-zinc-900 p-4 space-y-4"
              >
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {Object.entries(selectedSpecs).map(([specId, values]) =>
                      values.map(valueId => {
                        const spec = specifications.find(s => s._id === specId);
                        const value = spec?.specifications?.find(v => v._id === valueId);
                        if (!spec || !value) return null;
                        return (
                          <motion.span
                            key={`${specId}-${valueId}`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                          >
                            {value.spec}
                            <button
                              onClick={() => handleSpecChange(specId, valueId)}
                              className="hover:text-blue-300"
                            >
                              ×
                            </button>
                          </motion.span>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex justify-between items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearSpecs}
                    className="text-sm text-white/60 hover:text-white"
                  >
                    Clear all
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSpecsFilter(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpecificationsFilter;
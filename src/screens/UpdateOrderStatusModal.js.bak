import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { colors } from '../theme/colors';
import { STATUS_WORKFLOWS, getNextStatuses, getStatusInfo } from '../config/workflows';

export default function UpdateOrderStatusModal({ 
  visible, 
  onClose, 
  currentStatus, 
  workflowType,
  onUpdateStatus 
}) {
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [note, setNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const nextStatuses = getNextStatuses(currentStatus, workflowType);
  const currentStatusInfo = getStatusInfo(currentStatus, workflowType);

  const handleUpdate = async () => {
    if (!selectedStatus) return;
    
    setUpdating(true);
    await onUpdateStatus(selectedStatus, note);
    setUpdating(false);
    setSelectedStatus(null);
    setNote('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Update Status</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Current Status</Text>
              {currentStatusInfo && (
                <View style={[styles.statusCard, { borderColor: currentStatusInfo.color }]}>
                  <Text style={styles.statusIcon}>{currentStatusInfo.icon}</Text>
                  <View style={styles.statusInfo}>
                    <Text style={styles.statusLabel}>{currentStatusInfo.label}</Text>
                    <Text style={styles.statusDescription}>{currentStatusInfo.description}</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Update To:</Text>
              {nextStatuses.length === 0 ? (
                <Text style={styles.noOptions}>No further status updates available</Text>
              ) : (
                nextStatuses.map((status) => (
                  <TouchableOpacity
                    key={status.value}
                    style={[
                      styles.statusOption,
                      { borderColor: status.color },
                      selectedStatus === status.value && { 
                        backgroundColor: status.color + '20',
                        borderWidth: 2
                      }
                    ]}
                    onPress={() => setSelectedStatus(status.value)}
                  >
                    <Text style={styles.statusOptionIcon}>{status.icon}</Text>
                    <View style={styles.statusOptionInfo}>
                      <Text style={styles.statusOptionLabel}>{status.label}</Text>
                      <Text style={styles.statusOptionDescription}>{status.description}</Text>
                    </View>
                    <View style={[styles.radio, { borderColor: status.color }]}>
                      {selectedStatus === status.value && (
                        <View style={[styles.radioInner, { backgroundColor: status.color }]} />
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </View>

            {selectedStatus && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Add Note (Optional)</Text>
                <TextInput
                  style={styles.noteInput}
                  placeholder="Add details about this update..."
                  value={note}
                  onChangeText={setNote}
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.updateButton, (!selectedStatus || updating) && styles.updateButtonDisabled]}
              onPress={handleUpdate}
              disabled={!selectedStatus || updating}
            >
              <Text style={styles.updateButtonText}>
                {updating ? 'Updating...' : 'Update Status'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: colors.white, borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '90%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  closeButton: { fontSize: 24, color: colors.textSecondary },
  content: { padding: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary, marginBottom: 12, textTransform: 'uppercase' },
  statusCard: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.background, borderRadius: 12, borderWidth: 2 },
  statusIcon: { fontSize: 32, marginRight: 12 },
  statusInfo: { flex: 1 },
  statusLabel: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 4 },
  statusDescription: { fontSize: 14, color: colors.textSecondary },
  noOptions: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', paddingVertical: 20 },
  statusOption: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: colors.white, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  statusOptionIcon: { fontSize: 28, marginRight: 12 },
  statusOptionInfo: { flex: 1 },
  statusOptionLabel: { fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: 2 },
  statusOptionDescription: { fontSize: 13, color: colors.textSecondary },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioInner: { width: 12, height: 12, borderRadius: 6 },
  noteInput: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border, borderRadius: 12, padding: 12, fontSize: 14, color: colors.text, minHeight: 80, textAlignVertical: 'top' },
  footer: { flexDirection: 'row', padding: 20, gap: 12, borderTopWidth: 1, borderTopColor: colors.border },
  cancelButton: { flex: 1, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center' },
  cancelButtonText: { fontSize: 16, fontWeight: '600', color: colors.text },
  updateButton: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center' },
  updateButtonDisabled: { opacity: 0.5 },
  updateButtonText: { fontSize: 16, fontWeight: '700', color: colors.white },
});

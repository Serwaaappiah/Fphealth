import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/authContext';
import { useRouter } from 'expo-router';

const ReportComplaintPage = () => {
  const router = useRouter();
  const { user, submitComplaint } = useAuth();

  // Form state
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('Employee');
  const [department, setDepartment] = useState('');
  const [address, setAddress] = useState('');
  const [dateOfIncident, setDateOfIncident] = useState('');
  const [timeOfIncident, setTimeOfIncident] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [witnesses, setWitnesses] = useState('');
  const [firstTime, setFirstTime] = useState(null);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You need to be logged in to submit a complaint');
      return;
    }

    const fullComplaint = {
      name,
      title,
      phone,
      status,
      department,
      dateOfIncident,
      timeOfIncident,
      location,
      description,
      witnesses,
      firstTime,
    };

    const response = await submitComplaint('Complaint Form', JSON.stringify(fullComplaint), user.uid);

    if (response.success) {
      // Clear form
      setName('');
      setTitle('');
      setPhone('');
      setDepartment('');
      setDateOfIncident('');
      setTimeOfIncident('');
      setLocation('');
      setDescription('');
      setWitnesses('');
      setFirstTime(null);

      Alert.alert('Success', 'Complaint submitted successfully');
    } else {
      Alert.alert('Error', response.msg);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Employee Complaint Form</Text>

      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Your Name" />
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="Title" />
      <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="Phone Number" />

      <Text style={styles.label}>Status:</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity onPress={() => setStatus('Employee')}>
          <Text style={status === 'Employee' ? styles.radioSelected : styles.radio}>◉ Employee</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setStatus('Other')}>
          <Text style={status === 'Other' ? styles.radioSelected : styles.radio}>◉ Other</Text>
        </TouchableOpacity>
      </View>

      <TextInput style={styles.input} value={department} onChangeText={setDepartment} placeholder="Department" />


      <Text style={styles.sectionHeader}>Complaint Information</Text>
      <TextInput style={styles.input} value={dateOfIncident} onChangeText={setDateOfIncident} placeholder="Date of Incident" />
      <TextInput style={styles.input} value={timeOfIncident} onChangeText={setTimeOfIncident} placeholder="Time of Incident" />
      <TextInput style={styles.input} value={location} onChangeText={setLocation} placeholder="Location of Incident" />
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        numberOfLines={5}
        value={description}
        onChangeText={setDescription}
        placeholder="Please describe the incident in detail"
      />
      <TextInput
        style={[styles.input, { height: 80 }]}
        multiline
        numberOfLines={3}
        value={witnesses}
        onChangeText={setWitnesses}
        placeholder="Names and phone numbers of witnesses"
      />

      <Text style={styles.label}>Is this the first time you've raised this concern?</Text>
      <View style={styles.radioGroup}>
        <TouchableOpacity onPress={() => setFirstTime(true)}>
          <Text style={firstTime === true ? styles.radioSelected : styles.radio}>◉ Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setFirstTime(false)}>
          <Text style={firstTime === false ? styles.radioSelected : styles.radio}>◉ No</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.submitButton}>
        <Button title="Submit" onPress={handleSubmit} color="#2563eb" />
      </View>
      
    </ScrollView>
  );
};

export default ReportComplaintPage;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    gap: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#111',
  },
  label: {
    marginTop: 10,
    fontWeight: '500',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 15,
    marginVertical: 10,
  },
  radio: {
    fontSize: 16,
    color: '#555',
  },
  radioSelected: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

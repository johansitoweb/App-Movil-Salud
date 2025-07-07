import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, SafeAreaView, Alert, Dimensions } from 'react-native';

// Get screen width for responsive design (e.g., progress bars)
const { width } = Dimensions.get('window');

// Main App component
const App = () => {
  // State to manage loading screen visibility
  const [isLoading, setIsLoading] = useState(true);
  // State for loading progress
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Authentication states
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [loggedInPassword, setLoggedInPassword] = useState('');
  const [userName, setUserName] = useState(''); // Default user name, now set from login

  // State for navigation (dashboard, activities, food, profile)
  const [currentPage, setCurrentPage] = useState('dashboard');

  // State for health metrics
  const [steps, setSteps] = useState(0);
  const [waterIntake, setWaterIntake] = useState(0);
  const [caloriesBurned, setCaloriesBurned] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(70); // Default weight in kg

  // State for daily goals
  const [stepGoal, setStepGoal] = useState(10000); // Default step goal
  const [waterGoal, setWaterGoal] = useState(2000); // Default water goal in ml
  const [caloriesGoal, setCaloriesGoal] = useState(500); // Default calories burned goal
  const [weightGoal, setWeightGoal] = useState(65); // Default weight goal in kg

  // State for activities and food logs
  const [activities, setActivities] = useState([]);
  const [foodItems, setFoodItems] = useState([]);

  // Effect for the loading screen animation
  useEffect(() => {
    let interval;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingProgress(prevProgress => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            setIsLoading(false); // Hide loading screen when 100%
            return 100;
          }
          return prevProgress + 1; // Increment by 1%
        });
      }, 20); // Adjust interval for faster/slower loading (20ms = 2 seconds total)
    }
    return () => clearInterval(interval); // Cleanup on unmount or if isLoading changes
  }, [isLoading]);


  // Function to format date as MM/DD/YYYY
  const getFormattedDate = (date = new Date()) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${month}/${day}/${year}`;
  };

  // Function to handle step increment
  const handleAddSteps = () => {
    setSteps(prevSteps => prevSteps + 1000);
  };

  // Function to handle water intake increment (250ml per click)
  const handleAddWater = () => {
    setWaterIntake(prevWater => prevWater + 250);
  };

  // Function to handle calories burned increment (50 calories per click)
  const handleAddCalories = () => {
    setCaloriesBurned(prevCalories => prevCalories + 50);
  };

  // Function to handle weight update
  const handleSetWeight = (weight) => {
    const parsedWeight = parseFloat(weight);
    if (!isNaN(parsedWeight) && parsedWeight > 0) {
      setCurrentWeight(parsedWeight);
      Alert.alert('Peso Actualizado', `Tu peso actual es: ${parsedWeight} kg`);
    } else {
      Alert.alert('Error', 'Por favor, introduce un número válido para el peso.');
    }
  };

  // Function to add a new activity with distance, duration, and calories
  const handleAddActivity = (activity, date, distance, duration, calories) => {
    if (activity.trim() && date.trim()) {
      const activityCalories = parseInt(calories) || 0;
      setActivities(prevActivities => [
        ...prevActivities,
        {
          id: Date.now().toString(),
          text: activity,
          date: date,
          distance: parseFloat(distance) || 0, // Default to 0 if not a valid number
          duration: parseInt(duration) || 0, // Default to 0 if not a valid number
          calories: activityCalories,
        }
      ]);
      // Also update total calories burned on dashboard if this activity contributes
      setCaloriesBurned(prev => prev + activityCalories);
    } else {
      Alert.alert('Error', 'Por favor, introduce una actividad y una fecha.');
    }
  };

  // Function to delete an activity
  const handleDeleteActivity = (id) => {
    setActivities(prevActivities => {
      const activityToDelete = prevActivities.find(activity => activity.id === id);
      if (activityToDelete) {
        // Deduct calories from total if deleting an activity
        setCaloriesBurned(prev => prev - activityToDelete.calories);
      }
      return prevActivities.filter(activity => activity.id !== id);
    });
  };

  // Function to add a new food item
  const handleAddFood = (food, date) => {
    if (food.trim() && date.trim()) {
      setFoodItems(prevFood => [...prevFood, { id: Date.now().toString(), text: food, date: date }]);
    } else {
      Alert.alert('Error', 'Por favor, introduce un alimento y una fecha.');
    }
  };

  // Function to delete a food item
  const handleDeleteFood = (id) => {
    setFoodItems(prevFood => prevFood.filter(food => food.id !== id));
  };

  // --- Login Screen Component ---
  const LoginScreen = ({ onLogin }) => {
    const [name, setName] = useState(''); // New state for name
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginPress = () => {
      if (name.trim() === '' || email.trim() === '' || password.trim() === '') {
        Alert.alert('Error de Inicio de Sesión', 'Por favor, ingresa tu nombre, correo electrónico y contraseña.');
      } else {
        onLogin(name, email, password);
      }
    };

    return (
      <SafeAreaView style={loginStyles.loginContainer}>
        <Text style={loginStyles.loginTitle}>Bienvenido a SaludApp</Text>
        <TextInput
          style={loginStyles.input}
          placeholder="Nombre"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="words"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={loginStyles.input}
          placeholder="Correo Electrónico"
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={loginStyles.input}
          placeholder="Contraseña"
          placeholderTextColor="#9CA3AF"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={handleLoginPress}
          style={loginStyles.loginButton}
        >
          <Text style={loginStyles.loginButtonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  // --- Profile Screen Component ---
  const ProfileScreen = ({ userEmail, currentUserName, currentUserPassword, onUpdateProfile, onLogout }) => {
    const [editEmail, setEditEmail] = useState(userEmail); // Now editable
    const [editName, setEditName] = useState(currentUserName);
    const [editPassword, setEditPassword] = useState(currentUserPassword);

    const handleSaveChanges = () => {
      if (editName.trim() === '' || editPassword.trim() === '' || editEmail.trim() === '') {
        Alert.alert('Error', 'Todos los campos (nombre, correo, contraseña) deben estar llenos.');
      } else {
        onUpdateProfile(editName, editPassword, editEmail); // Pass email back
        Alert.alert('Éxito', 'Perfil actualizado correctamente.');
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View>
          <Text style={styles.pageTitle}>Mi Perfil</Text>
          <View style={profileStyles.profileInputGroup}>
            <Text style={profileStyles.profileLabel}>Correo Electrónico:</Text>
            <TextInput
              style={profileStyles.profileInput}
              value={editEmail}
              onChangeText={setEditEmail}
              placeholder="Tu correo electrónico"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={profileStyles.profileInputGroup}>
            <Text style={profileStyles.profileLabel}>Nombre de Usuario:</Text>
            <TextInput
              style={profileStyles.profileInput}
              value={editName}
              onChangeText={setEditName}
              placeholder="Tu nombre"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={profileStyles.profileInputGroup}>
            <Text style={profileStyles.profileLabel}>Contraseña:</Text>
            <TextInput
              style={profileStyles.profileInput}
              value={editPassword}
              onChangeText={setEditPassword}
              placeholder="Tu contraseña"
              placeholderTextColor="#9CA3AF"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            onPress={handleSaveChanges}
            style={profileStyles.saveButton}
          >
            <Text style={profileStyles.saveButtonText}>Guardar Cambios</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onLogout}
            style={profileStyles.logoutButton}
          >
            <Text style={profileStyles.logoutButtonText}>Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };


  // Component for the Dashboard page
  const Dashboard = () => {
    const stepsProgress = Math.min(steps / stepGoal, 1);
    const waterProgress = Math.min(waterIntake / waterGoal, 1);
    const caloriesProgress = Math.min(caloriesBurned / caloriesGoal, 1);
    // Weight progress is inverse: closer to goal, higher progress (if goal is lower than current)
    const weightProgress = currentWeight <= weightGoal ? 1 : Math.max(0, 1 - (currentWeight - weightGoal) / (currentWeight > weightGoal ? currentWeight - weightGoal : 1));


    const [newStepGoal, setNewStepGoal] = useState(stepGoal.toString());
    const [newWaterGoal, setNewWaterGoal] = useState(waterGoal.toString());
    const [newCaloriesGoal, setNewCaloriesGoal] = useState(caloriesGoal.toString());
    const [newWeightInput, setNewWeightInput] = useState(currentWeight.toString());
    const [newWeightGoal, setNewWeightGoal] = useState(weightGoal.toString());


    const handleSetStepGoal = () => {
      const parsedGoal = parseInt(newStepGoal);
      if (!isNaN(parsedGoal) && parsedGoal > 0) {
        setStepGoal(parsedGoal);
        Alert.alert('Meta Actualizada', `Tu meta de pasos es ahora: ${parsedGoal}`);
      } else {
        Alert.alert('Error', 'Por favor, introduce un número válido para la meta de pasos.');
      }
    };

    const handleSetWaterGoal = () => {
      const parsedGoal = parseInt(newWaterGoal);
      if (!isNaN(parsedGoal) && parsedGoal > 0) {
        setWaterGoal(parsedGoal);
        Alert.alert('Meta Actualizada', `Tu meta de agua es ahora: ${parsedGoal} ml`);
      } else {
        Alert.alert('Error', 'Por favor, introduce un número válido para la meta de agua.');
      }
    };

    const handleSetCaloriesGoal = () => {
      const parsedGoal = parseInt(newCaloriesGoal);
      if (!isNaN(parsedGoal) && parsedGoal > 0) {
        setCaloriesGoal(parsedGoal);
        Alert.alert('Meta Actualizada', `Tu meta de calorías quemadas es ahora: ${parsedGoal}`);
      } else {
        Alert.alert('Error', 'Por favor, introduce un número válido para la meta de calorías.');
      }
    };

    const handleUpdateWeight = () => {
      handleSetWeight(newWeightInput);
    };

    const handleSetWeightGoal = () => {
      const parsedGoal = parseFloat(newWeightGoal);
      if (!isNaN(parsedGoal) && parsedGoal > 0) {
        setWeightGoal(parsedGoal);
        Alert.alert('Meta Actualizada', `Tu meta de peso es ahora: ${parsedGoal} kg`);
      } else {
        Alert.alert('Error', 'Por favor, introduce un número válido para la meta de peso.');
      }
    };

    return (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.dashboardTitle}>Panel de Control de Salud</Text>

        {/* Health Metrics Section - Horizontal Scroll */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.metricsScrollView}>
          {/* Steps Card */}
          <View style={[styles.metricCard, { backgroundColor: '#60A5FA' }]}>
            <Text style={styles.metricLabel}>Pasos</Text>
            <Text style={styles.metricValue}>{steps}</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${stepsProgress * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(stepsProgress * 100)}% de la meta ({stepGoal} pasos)</Text>
            <TouchableOpacity
              onPress={handleAddSteps}
              style={styles.metricButton}
            >
              <Text style={styles.metricButtonText}>Añadir 1000 Pasos</Text>
            </TouchableOpacity>
            <View style={styles.goalInputContainer}>
              <TextInput
                style={styles.goalTextInput}
                value={newStepGoal}
                onChangeText={setNewStepGoal}
                keyboardType="numeric"
                placeholder="Meta de Pasos"
                placeholderTextColor="#E2E8F0"
              />
              <TouchableOpacity onPress={handleSetStepGoal} style={styles.setGoalButton}>
                <Text style={styles.setGoalButtonText}>Establecer</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Water Intake Card */}
          <View style={[styles.metricCard, { backgroundColor: '#4ADE80' }]}>
            <Text style={styles.metricLabel}>Ingesta de Agua</Text>
            <Text style={styles.metricValue}>{waterIntake} ml</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${waterProgress * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(waterProgress * 100)}% de la meta ({waterGoal} ml)</Text>
            <TouchableOpacity
              onPress={handleAddWater}
              style={styles.metricButton}
            >
              <Text style={styles.metricButtonText}>Añadir 250 ml</Text>
            </TouchableOpacity>
            <View style={styles.goalInputContainer}>
              <TextInput
                style={styles.goalTextInput}
                value={newWaterGoal}
                onChangeText={setNewWaterGoal}
                keyboardType="numeric"
                placeholder="Meta de Agua (ml)"
                placeholderTextColor="#E2E8F0"
              />
              <TouchableOpacity onPress={handleSetWaterGoal} style={styles.setGoalButton}>
                <Text style={styles.setGoalButtonText}>Establecer</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Calories Burned Card */}
          <View style={[styles.metricCard, { backgroundColor: '#FACC15' }]}>
            <Text style={styles.metricLabel}>Calorías Quemadas</Text>
            <Text style={styles.metricValue}>{caloriesBurned}</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${caloriesProgress * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{Math.round(caloriesProgress * 100)}% de la meta ({caloriesGoal} cal)</Text>
            <TouchableOpacity
              onPress={handleAddCalories}
              style={styles.metricButton}
            >
              <Text style={styles.metricButtonText}>Añadir 50 Cal</Text>
            </TouchableOpacity>
            <View style={styles.goalInputContainer}>
              <TextInput
                style={styles.goalTextInput}
                value={newCaloriesGoal}
                onChangeText={setNewCaloriesGoal}
                keyboardType="numeric"
                placeholder="Meta de Calorías"
                placeholderTextColor="#E2E8F0"
              />
              <TouchableOpacity onPress={handleSetCaloriesGoal} style={styles.setGoalButton}>
                <Text style={styles.setGoalButtonText}>Establecer</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Weight Tracking Card */}
          <View style={[styles.metricCard, { backgroundColor: '#EC4899' }]}>
            <Text style={styles.metricLabel}>Peso Actual</Text>
            <Text style={styles.metricValue}>{currentWeight} kg</Text>
            <View style={styles.progressBarBackground}>
              <View style={[styles.progressBarFill, { width: `${weightProgress * 100}%` }]} />
            </View>
            <Text style={styles.progressText}>{weightProgress === 1 ? 'Meta Alcanzada!' : `Meta: ${weightGoal} kg`}</Text>
            <View style={styles.goalInputContainer}>
              <TextInput
                style={styles.goalTextInput}
                value={newWeightInput}
                onChangeText={setNewWeightInput}
                keyboardType="numeric"
                placeholder="Registrar Peso"
                placeholderTextColor="#E2E8F0"
              />
              <TouchableOpacity onPress={handleUpdateWeight} style={styles.setGoalButton}>
                <Text style={styles.setGoalButtonText}>Registrar</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.goalInputContainer}>
              <TextInput
                style={styles.goalTextInput}
                value={newWeightGoal}
                onChangeText={setNewWeightGoal}
                keyboardType="numeric"
                placeholder="Meta de Peso"
                placeholderTextColor="#E2E8F0"
              />
              <TouchableOpacity onPress={handleSetWeightGoal} style={styles.setGoalButton}>
                <Text style={styles.setGoalButtonText}>Establecer Meta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Today's Summary Section */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen del Día</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pasos:</Text>
            <Text style={styles.summaryValue}>{steps} / {stepGoal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Agua:</Text>
            <Text style={styles.summaryValue}>{waterIntake}ml / {waterGoal}ml</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Calorías Quemadas:</Text>
            <Text style={styles.summaryValue}>{caloriesBurned} / {caloriesGoal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Peso Actual:</Text>
            <Text style={styles.summaryValue}>{currentWeight} kg (Meta: {weightGoal} kg)</Text>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.quickActionsTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsButtons}>
            <TouchableOpacity
              onPress={() => setCurrentPage('activities')}
              style={[styles.actionButton, { backgroundColor: '#A78BFA' }]}
            >
              <Text style={styles.actionButtonText}>📝 Registrar Actividad</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setCurrentPage('food')}
              style={[styles.actionButton, { backgroundColor: '#FB923C' }]}
            >
              <Text style={styles.actionButtonText}>🍎 Registrar Comida</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    );
  };

  // Component for the Activities page
  const Activities = () => {
    const [newActivity, setNewActivity] = useState('');
    const [activityDate, setActivityDate] = useState(getFormattedDate());
    const [newDistance, setNewDistance] = useState('');
    const [newDuration, setNewDuration] = useState(''); // in minutes
    const [newCalories, setNewCalories] = useState(''); // calories burned by this activity

    // Calculate total values for summary cards
    const totalDistance = activities.reduce((sum, activity) => sum + activity.distance, 0);
    const totalDurationMinutes = activities.reduce((sum, activity) => sum + activity.duration, 0);
    const totalCaloriesActivity = activities.reduce((sum, activity) => sum + activity.calories, 0);

    // Format total duration into hours and minutes
    const formatDuration = (totalMinutes) => {
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}h ${minutes}m`;
    };

    const handleSubmit = () => {
      handleAddActivity(newActivity, activityDate, newDistance, newDuration, newCalories);
      setNewActivity('');
      setNewDistance('');
      setNewDuration('');
      setNewCalories('');
      setActivityDate(getFormattedDate()); // Reset date to today after submission
    };

    return (
      <View style={styles.card}>
        <Text style={styles.pageTitle}>Mis Actividades</Text>

        {/* Removed Activity Summary Cards - Horizontal Scroll */}
        {/*
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activitySummaryScrollView}>
          <View style={[styles.activitySummaryCard, { backgroundColor: '#8B5CF6' }]}>
            <Text style={styles.activitySummaryLabel}>Distancia Total</Text>
            <Text style={styles.activitySummaryValue}>{totalDistance.toFixed(1)} km</Text>
          </View>
          <View style={[styles.activitySummaryCard, { backgroundColor: '#10B981' }]}>
            <Text style={styles.activitySummaryLabel}>Duración Total</Text>
            <Text style={styles.activitySummaryValue}>{formatDuration(totalDurationMinutes)}</Text>
          </View>
          <View style={[styles.activitySummaryCard, { backgroundColor: '#EF4444' }]}>
            <Text style={styles.activitySummaryLabel}>Calorías Actividad</Text>
            <Text style={styles.activitySummaryValue}>{totalCaloriesActivity} cal</Text>
          </View>
        </ScrollView>
        */}

        <View style={styles.inputForm}>
          <TextInput
            style={styles.textInput}
            value={newActivity}
            onChangeText={setNewActivity}
            placeholder="Ej. Caminar 30 minutos"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            style={styles.textInput}
            value={newDistance}
            onChangeText={setNewDistance}
            placeholder="Distancia (km)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.textInput}
            value={newDuration}
            onChangeText={setNewDuration}
            placeholder="Duración (minutos)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.textInput}
            value={newCalories}
            onChangeText={setNewCalories}
            placeholder="Calorías Quemadas"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.textInput}
            value={activityDate}
            onChangeText={setActivityDate}
            placeholder="Fecha (MM/DD/YYYY)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numbers-and-punctuation"
          />
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.addButton, { backgroundColor: '#A78BFA' }]}
          >
            <Text style={styles.addButtonText}>Añadir Actividad</Text>
          </TouchableOpacity>
        </View>

        {activities.length === 0 ? (
          <Text style={styles.emptyListText}>No hay actividades registradas aún.</Text>
        ) : (
          <ScrollView style={styles.listContainer}>
            {activities.map((activity) => (
              <View key={activity.id} style={styles.listItem}>
                <View>
                  <Text style={styles.listItemText}>{activity.text}</Text>
                  <Text style={styles.listItemDate}>
                    {activity.date} | {activity.distance} km | {activity.duration} min | {activity.calories} cal
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteActivity(activity.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  // Component for the Food page
  const Food = () => {
    const [newFood, setNewFood] = useState('');
    const [foodDate, setFoodDate] = useState(getFormattedDate());
    const [newFoodCalories, setNewFoodCalories] = useState('');
    const [newProtein, setNewProtein] = useState('');
    const [newCarbs, setNewCarbs] = useState('');
    const [newFat, setNewFat] = useState('');

    const handleSubmit = () => {
      handleAddFood(newFood, foodDate, newFoodCalories, newProtein, newCarbs, newFat);
      setNewFood('');
      setNewFoodCalories('');
      setNewProtein('');
      setNewCarbs('');
      setNewFat('');
      setFoodDate(getFormattedDate()); // Reset date to today after submission
    };

    return (
      // Removed the 'card' style from this View
      <View>
        <Text style={styles.pageTitle}>Mi Registro de Comida</Text>

        {/* Removed Food Summary Cards - Horizontal Scroll */}
        {/*
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.foodSummaryScrollView}>
          <View style={[styles.foodSummaryCard, { backgroundColor: '#FB923C' }]}>
            <Text style={styles.foodSummaryLabel}>Calorías Consumidas</Text>
            <Text style={styles.foodSummaryValue}>{foodItems.reduce((sum, item) => sum + item.calories, 0)} cal</Text>
          </View>
          <View style={[styles.foodSummaryCard, { backgroundColor: '#3B82F6' }]}>
            <Text style={styles.foodSummaryLabel}>Proteínas</Text>
            <Text style={styles.foodSummaryValue}>{foodItems.reduce((sum, item) => sum + item.protein, 0).toFixed(1)} g</Text>
          </View>
          <View style={[styles.foodSummaryCard, { backgroundColor: '#FACC15' }]}>
            <Text style={styles.foodSummaryLabel}>Carbohidratos</Text>
            <Text style={styles.foodSummaryValue}>{foodItems.reduce((sum, item) => sum + item.carbs, 0).toFixed(1)} g</Text>
          </View>
          <View style={[styles.foodSummaryCard, { backgroundColor: '#EF4444' }]}>
            <Text style={styles.foodSummaryLabel}>Grasas</Text>
            <Text style={styles.foodSummaryValue}>{foodItems.reduce((sum, item) => sum + item.fat, 0).toFixed(1)} g</Text>
          </View>
        </ScrollView>
        */}

        <View style={styles.inputForm}>
          <TextInput
            style={styles.textInput}
            value={newFood}
            onChangeText={setNewFood}
            placeholder="Nombre del Alimento"
            placeholderTextColor="#9CA3AF"
          />
          <TextInput
            style={styles.textInput}
            value={newFoodCalories}
            onChangeText={setNewFoodCalories}
            placeholder="Calorías (cal)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.textInput}
            value={newProtein}
            onChangeText={setNewProtein}
            placeholder="Proteínas (g)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.textInput}
            value={newCarbs}
            onChangeText={setNewCarbs}
            placeholder="Carbohidratos (g)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.textInput}
            value={newFat}
            onChangeText={setNewFat}
            placeholder="Grasas (g)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
          />
          <TextInput
            style={styles.textInput}
            value={foodDate}
            onChangeText={setFoodDate}
            placeholder="Fecha (MM/DD/YYYY)"
            placeholderTextColor="#9CA3AF"
            keyboardType="numbers-and-punctuation"
          />
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.addButton, { backgroundColor: '#FB923C' }]}
          >
            <Text style={styles.addButtonText}>Añadir Comida</Text>
          </TouchableOpacity>
        </View>

        {foodItems.length === 0 ? (
          <Text style={styles.emptyListText}>No hay alimentos registrados aún.</Text>
        ) : (
          <ScrollView style={styles.listContainer}>
            {foodItems.map((food) => (
              <View key={food.id} style={styles.listItem}>
                <View>
                  <Text style={styles.listItemText}>{food.text}</Text>
                  <Text style={styles.listItemDate}>
                    {food.date} | {food.calories} cal | P: {food.protein}g | C: {food.carbs}g | G: {food.fat}g
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteFood(food.id)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  // --- Loading Screen Component ---
  const LoadingScreen = () => (
    <View style={loadingStyles.loadingContainer}>
      <Text style={loadingStyles.loadingText}>Cargando Aplicación de Salud...</Text>
      <View style={loadingStyles.progressBarBackground}>
        <View style={[loadingStyles.progressBarFill, { width: `${loadingProgress}%` }]} />
      </View>
      <Text style={loadingStyles.progressPercentage}>{loadingProgress}%</Text>
    </View>
  );

  // Conditional rendering for loading screen, login screen, or main app
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isLoggedIn) {
    return (
      <LoginScreen
        onLogin={(name, email, password) => {
          setUserName(name);
          setLoggedInEmail(email);
          setLoggedInPassword(password);
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Page Content based on currentPage state */}
      <View style={styles.contentContainer}>
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'activities' && <Activities />}
        {currentPage === 'food' && <Food />}
        {currentPage === 'profile' && (
          <ProfileScreen
            userEmail={loggedInEmail}
            currentUserName={userName}
            currentUserPassword={loggedInPassword}
            onUpdateProfile={(newName, newPassword, newEmail) => {
              setUserName(newName);
              setLoggedInPassword(newPassword);
              setLoggedInEmail(newEmail); // Update email in App state
            }}
            onLogout={() => {
              setIsLoggedIn(false);
              setLoggedInEmail('');
              setLoggedInPassword('');
              setUserName(''); // Reset user name on logout
              setCurrentPage('dashboard'); // Go back to dashboard after logout
            }}
          />
        )}
      </View>

      {/* Navigation Bar (moved to bottom) */}
      <View style={styles.navigationBar}>
        <TouchableOpacity
          onPress={() => setCurrentPage('dashboard')}
          style={[
            styles.navButton,
            currentPage === 'dashboard' && styles.navButtonActive,
          ]}
        >
          <Text style={styles.navIcon}>🏠</Text>
          {currentPage === 'dashboard' && <Text style={styles.navText}>Panel</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentPage('activities')}
          style={[
            styles.navButton,
            currentPage === 'activities' && styles.navButtonActive,
          ]}
        >
          <Text style={styles.navIcon}>🏃</Text>
          {currentPage === 'activities' && <Text style={styles.navText}>Actividades</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentPage('food')}
          style={[
            styles.navButton,
            currentPage === 'food' && styles.navButtonActive,
          ]}
        >
          <Text style={styles.navIcon}>🍎</Text>
          {currentPage === 'food' && <Text style={styles.navText}>Comida</Text>}
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setCurrentPage('profile')}
          style={[
            styles.navButton,
            currentPage === 'profile' && styles.navButtonActive,
          ]}
        >
          <Text style={styles.navIcon}>👤</Text>
          {currentPage === 'profile' && <Text style={styles.navText}>Perfil</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// Stylesheet for React Native components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F2F5', // Lighter background for a fresh look
  },
  scrollViewContent: {
    paddingBottom: 20, // Add some padding at the bottom of the scroll view
  },
  navigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute items evenly
    backgroundColor: '#FFFFFF',
    paddingVertical: 10, // Vertical padding for footer
    paddingHorizontal: 16,
    borderTopLeftRadius: 20, // Rounded top corners for footer
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 }, // Shadow pointing upwards
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8, // For Android shadow
  },
  navButton: {
    flex: 1, // Distribute space evenly
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 10, // Slightly rounded for active state
  },
  navButtonActive: {
    backgroundColor: '#E0E0E0', // Light gray background for active state
  },
  navIcon: {
    fontSize: 24, // Larger icon size
    marginBottom: 4, // Space between icon and text
  },
  navText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333333', // Darker text color
  },
  contentContainer: {
    flex: 1, // Takes up all available space above the footer
    paddingHorizontal: 16,
    paddingTop: 20, // Add padding at the top for content
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15, // More rounded corners
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // Deeper shadow
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 20, // Add margin between cards if multiple
  },
  dashboardTitle: {
    fontSize: 28, // Larger title
    fontWeight: '800', // Bolder
    color: '#1F2937',
    marginBottom: 28, // More space
    textAlign: 'center',
  },
  metricsScrollView: {
    paddingVertical: 10,
  },
  metricCard: {
    width: width * 0.75, // Adjusted width to 75% of screen width
    marginHorizontal: 8, // Add horizontal margin for spacing in the slider
    paddingVertical: 15, // Reduced vertical padding to make it less tall
    paddingHorizontal: 20, // Adjusted horizontal padding
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 40,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  progressBarBackground: {
    height: 6,
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  metricButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricButtonText: {
    color: '#3B82F6', // Default color, will be overridden by specific card styles
    fontWeight: '700',
    fontSize: 14,
  },
  goalInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goalTextInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    padding: 6,
    color: '#FFFFFF',
    marginRight: 6,
    textAlign: 'center',
    fontSize: 12,
  },
  setGoalButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  setGoalButtonText: {
    color: '#3B82F6', // Default color, will be overridden by specific card styles
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Styles for Today's Summary
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 20, // Space from the horizontal cards
    marginHorizontal: 0, // Removed horizontal margin as it's now handled by contentContainer
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // Light gray border
  },
  summaryLabel: {
    fontSize: 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
  },
  // Styles for Quick Actions
  quickActionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginTop: 20,
    marginHorizontal: 0,
  },
  quickActionsTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  quickActionsButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1F2937',
    marginBottom: 28,
    textAlign: 'center',
  },
  inputForm: {
    marginBottom: 24,
    flexDirection: 'column',
    gap: 16,
    marginTop: 20,
  },
  textInput: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 10,
    color: '#1F2937',
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  addButton: {
    paddingVertical: 15,
    paddingHorizontal: 24,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  emptyListText: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 30,
    fontSize: 16,
  },
  listContainer: {
    maxHeight: 400,
    paddingBottom: 10,
  },
  listItem: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#A78BFA',
  },
  listItemText: {
    color: '#000000', // Changed to black
    fontWeight: '600',
    fontSize: 16,
    flexShrink: 1,
  },
  listItemDate: {
    color: '#000000', // Changed to black
    fontSize: 13,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 5,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Styles for Activity Summary Cards
  activitySummaryScrollView: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  activitySummaryCard: {
    width: width * 0.4,
    height: 120,
    marginHorizontal: 8,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activitySummaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  activitySummaryValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // New styles for Food Summary Cards (added for future use in food view)
  foodSummaryScrollView: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  foodSummaryCard: {
    width: width * 0.4, // Similar size to activity summary cards
    height: 120,
    marginHorizontal: 8,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodSummaryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  foodSummaryValue: {
    fontSize: 24, // Slightly smaller font for macros
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

// Styles specifically for the loading screen
const loadingStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  progressBarBackground: {
    width: '80%',
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 5,
    overflow: 'hidden', // Ensures the fill stays within bounds
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6', // Blue progress bar
    borderRadius: 5,
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 10,
  },
});

// Styles specifically for the login screen
const loginStyles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F2F5',
    paddingHorizontal: 20,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// Styles specifically for the profile screen
const profileStyles = StyleSheet.create({
  profileInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  profileValue: {
    fontSize: 16,
    color: '#1F2937',
  },
  profileInputGroup: {
    marginBottom: 15,
  },
  profileInput: {
    width: '100%',
    height: 50,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginTop: 8,
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  saveButton: {
    backgroundColor: '#10B981', // Green for save
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#EF4444', // Red for logout
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default App;

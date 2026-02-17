<x-filament-panels::page>
    <div class="space-y-6" x-data="appointmentCalendar">
        <div id="calendar"></div>
    </div>

    @push('scripts')
        <script src='https://cdn.jsdelivr.net/npm/fullcalendar@6.1.10/index.global.min.js'></script>
        <script>
            document.addEventListener('alpine:init', () => {
                Alpine.data('appointmentCalendar', () => ({
                    init() {
                        const calendarEl = document.getElementById('calendar');
                        const calendar = new FullCalendar.Calendar(calendarEl, {
                            initialView: 'dayGridMonth',
                            headerToolbar: {
                                left: 'prev,next today',
                                center: 'title',
                                right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                            },
                            events: @js($this->getViewData()['appointments']),
                            eventClick: function(info) {
                                const event = info.event;
                                const props = event.extendedProps;
                                
                                Swal.fire({
                                    title: event.title,
                                    html: `
                                        <div class="text-left space-y-2">
                                            <p><strong>Patient:</strong> ${props.patient}</p>
                                            <p><strong>Doctor:</strong> ${props.doctor}</p>
                                            <p><strong>Time:</strong> ${props.timeslot}</p>
                                            <p><strong>Status:</strong> <span class="capitalize">${props.status}</span></p>
                                            ${props.notes ? `<p><strong>Notes:</strong> ${props.notes}</p>` : ''}
                                        </div>
                                    `,
                                    confirmButtonText: 'Close',
                                    confirmButtonColor: '#10b981',
                                    width: 500,
                                });
                            },
                            height: 'auto',
                            aspectRatio: 1.8,
                            eventTimeFormat: {
                                hour: '2-digit',
                                minute: '2-digit',
                                meridiem: false
                            },
                            buttonText: {
                                today: 'Today',
                                month: 'Month',
                                week: 'Week',
                                day: 'Day',
                                list: 'List'
                            },
                            themeSystem: 'standard',
                            eventDisplay: 'block',
                            displayEventTime: false,
                        });
                        
                        calendar.render();
                    }
                }));
            });
        </script>
        <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
        <style>
            #calendar {
                background: white;
                padding: 1.5rem;
                border-radius: 0.75rem;
                box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
            }
            .fc-event {
                cursor: pointer;
                padding: 2px 5px;
                border-radius: 4px;
                font-size: 0.875rem;
            }
            .fc-toolbar-title {
                font-size: 1.5rem !important;
                font-weight: 600 !important;
            }
            .fc-button {
                background-color: #10b981 !important;
                border-color: #10b981 !important;
            }
            .fc-button:hover {
                background-color: #059669 !important;
                border-color: #059669 !important;
            }
            .fc-button-active {
                background-color: #047857 !important;
                border-color: #047857 !important;
            }
            .fc-daygrid-day-number {
                padding: 4px;
                font-size: 0.875rem;
            }
            .fc-col-header-cell-cushion {
                padding: 8px 4px;
                font-weight: 600;
            }
            @media (max-width: 768px) {
                .fc-toolbar {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .fc-toolbar-title {
                    font-size: 1.25rem !important;
                    margin: 0.5rem 0;
                }
            }
        </style>
    @endpush
</x-filament-panels::page>
